package backend

import (
	"bufio"
	"context"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

const inputFilePattern = "*.JPG;*.JPEG;*.jpg;*.jpeg"

// App struct
type App struct {
	ctx         context.Context
	logFilePath string

	bundleSetupFinished bool
	startupDone         chan struct{}
}

type Report struct {
	success   bool
	error     *string
	successes []SuccessfulFileReport
	failures  []string
}

type SuccessfulFileReport struct {
	input           string
	output          string
	outputSizeBytes uint64
	warnings        []ReportWarning
}

type FailedFileReport struct {
	input string
	error string
}

type ReportWarning struct {
	stage    string
	severity string
	code     string
	message  string
	context  []ReportWarningContext
}

type ReportWarningContext struct {
	key   string
	value string
}

// NewApp creates a new App application struct
func NewApp(logFilepath string) *App {
	return &App{
		logFilePath: logFilepath,
		startupDone: make(chan struct{}),
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx

	// handle drag and drop (might add later)
	// runtime.OnFileDrop(a.ctx, func(x, y int, paths []string) {
	// 	if len(paths) > 0 {
	// 		// We can add this later if we want
	// 	}
	// })

	close(a.startupDone)
}

func (a *App) OpenInputFilePicker() ([]string, error) {
	selection, err := runtime.OpenMultipleFilesDialog(a.ctx, runtime.OpenDialogOptions{
		Title:           "Input",
		ShowHiddenFiles: true,
		Filters: []runtime.FileFilter{
			{
				DisplayName: "DJI RJPEGs",
				Pattern:     inputFilePattern,
			},
		},
	})
	if err != nil {
		return selection, err
	}

	return selection, nil
}

func (a *App) OpenInputFolderPicker() ([]string, error) {
	selection, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title:           "Input",
		ShowHiddenFiles: true,
		Filters: []runtime.FileFilter{
			{
				DisplayName: "DJI RJPEGs",
				Pattern:     inputFilePattern,
			},
		},
	})
	if err != nil {
		return nil, err
	}
	if selection == "" {
		return []string{}, nil
	}

	return matchingFiles(selection, inputFilePattern)
}

func matchingFiles(directory, pattern string) ([]string, error) {
	entries, err := os.ReadDir(directory)
	if err != nil {
		return nil, err
	}

	patterns := strings.Split(pattern, ";")
	files := make([]string, 0)
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}

		for _, pattern := range patterns {
			matches, err := filepath.Match(pattern, entry.Name())
			if err != nil {
				return nil, err
			}
			if matches {
				files = append(files, filepath.Join(directory, entry.Name()))
				break
			}
		}
	}

	return files, nil
}

func (a *App) OpenSaveLocationPicker() (string, error) {
	selection, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title:           "Output",
		ShowHiddenFiles: true,
		Filters: []runtime.FileFilter{
			{
				DisplayName: "DJI RJPEGs",
				Pattern:     inputFilePattern,
			},
		},
	})
	if err != nil {
		return selection, err
	}

	return selection, nil
}

func (a *App) RunConversion(filepaths []string, useLRF bool, outputDir string, suffix string) error {
	<-a.startupDone

	thermographyConverterPath := getThermographyConverterPath()
	args := []string{
		"--report-format", "json",
		"--output-dir", outputDir,
	}
	if suffix != "" {
		args = append(args, "--suffix", suffix)
	}
	if useLRF {
		args = append(args, "--use-lrf-distance")
	}
	args = append(filepaths, args...)
	cmd := exec.Command(thermographyConverterPath, args...)
	hideConsole(cmd)

	stdOut, err := cmd.StdoutPipe()
	if err != nil {
		return err
	}
	if err := cmd.Start(); err != nil {
		return err
	}

	// Consume stdout until the converter exits. scanner.Text() contains one
	// complete output line (without its trailing newline), ready for handling.
	scanner := bufio.NewScanner(stdOut)
	go func() {
		for scanner.Scan() {
			line := scanner.Text()
			if progressString := strings.TrimPrefix(line, "PROGRESS: "); progressString != line {
				progress, err := strconv.Atoi(progressString)
				if err != nil {
					runtime.LogWarningf(a.ctx, "Was unable to parse progress update as int: %s", err.Error())
					continue
				}
				runtime.EventsEmit(a.ctx, "progress", progress)
			} else if reportString := strings.TrimPrefix(line, "REPORT: "); reportString != line {
				runtime.EventsEmit(a.ctx, "report", reportString)
			}
		}
		if err := scanner.Err(); err != nil {
			runtime.LogErrorf(a.ctx, "Error reading from stdout: %s", err.Error())
			runtime.EventsEmit(a.ctx, "converter-error", "converterError.stdOut")
		}
		if err := cmd.Wait(); err != nil {
			runtime.LogErrorf(a.ctx, "Error when executing thermography-converter: %s", err.Error())
			runtime.EventsEmit(a.ctx, "converter-error", "converterError.cmdExecution")
		}
		runtime.EventsEmit(a.ctx, "conversion-finished")
	}()

	return nil
}
