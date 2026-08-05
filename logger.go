package main

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"time"

	"github.com/wailsapp/wails/v2/pkg/logger"
)

type FileLogger struct {
	file *os.File
}

func NewFileLogger(logpath string) (*FileLogger, error) {
	// Create parent directory if it doesn't exist
	dir := filepath.Dir(logpath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return nil, err
	}

	file, err := os.OpenFile(logpath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
	if err != nil {
		return nil, err
	}
	return &FileLogger{file: file}, nil
}

func (l *FileLogger) log(level string, message string) {
	timestamp := time.Now().Format("2006-01-02 15:04:05")
	logLine := fmt.Sprintf("[%s] %s: %s\n", timestamp, level, message)

	fmt.Print(logLine)
	if l.file != nil {
		l.file.WriteString(logLine)
	}
}

func (l *FileLogger) Print(message string) {
	l.log("INFO", message)
}

func (l *FileLogger) Trace(message string) {
	l.log("TRACE", message)
}

func (l *FileLogger) Debug(message string) {
	l.log("DEBUG", message)
}

func (l *FileLogger) Info(message string) {
	l.log("INFO", message)
}

func (l *FileLogger) Warning(message string) {
	l.log("WARNING", message)
}

func (l *FileLogger) Error(message string) {
	l.log("ERROR", message)
}

func (l *FileLogger) Fatal(message string) {
	l.log("FATAL", message)
	os.Exit(1)
}

func (l *FileLogger) Close() error {
	if l.file != nil {
		return l.file.Close()
	}
	return nil
}

func (l *FileLogger) SetLogLevel(level logger.LogLevel) {
	// No-op for this simple implementation
}

func (l *FileLogger) Write(p []byte) (n int, err error) {
	message := string(p)
	l.log("INFO", message)
	return len(p), nil
}

var _ logger.Logger = (*FileLogger)(nil)
var _ io.Writer = (*FileLogger)(nil)
