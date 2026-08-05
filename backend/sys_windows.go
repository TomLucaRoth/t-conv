//go:build windows

package backend

import (
	"os"
	"os/exec"
	"path/filepath"
	"syscall"
)

func hideConsole(cmd *exec.Cmd) {
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
}

func GetAppDataPath() string {
	localAppData := os.Getenv("LOCALAPPDATA")
	if localAppData == "" {
		return "thermo-convert"
	}
	return filepath.Join(localAppData, "thermo-convert")
}

func getThermographyConverterPath() string {
	return filepath.Join(GetAppDataPath(), "thermography-converter.exe")
}
