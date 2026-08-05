//go:build darwin

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
	home, err := os.UserHomeDir()
	if err != nil {
		return "thermo-convert"
	}
	return filepath.Join(home, "Library", "Application Support", "thermo-convert")
}

func getThermographyConverterPath() string {
	return filepath.Join(GetAppDataPath(), "thermography-converter")
}
