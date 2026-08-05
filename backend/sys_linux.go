//go:build linux

package backend

import (
	"os"
	"os/exec"
	"path/filepath"
)

func hideConsole(cmd *exec.Cmd) {
	// macOS and Linux don't show a terminal window when
	// running exec.Command, so we do nothing.
}

func GetAppDataPath() string {
	dataHome := os.Getenv("XDG_DATA_HOME")
	if dataHome == "" {
		home, err := os.UserHomeDir()
		if err == nil {
			dataHome = filepath.Join(home, ".local", "share")
		} else {
			dataHome = ""
		}
	}

	return filepath.Join(dataHome, "thermo-convert")
}

func getThermographyConverterPath() string {
	return filepath.Join(GetAppDataPath(), "thermography-converter")
}
