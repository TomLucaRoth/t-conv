package main

import (
	"embed"
	"fmt"
	"log"
	"path/filepath"

	"thermo-convert/backend"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed bundled
var bundled embed.FS

func main() {
	logFilePath := filepath.Join(backend.GetAppDataPath(), "log.txt")
	// Create an instance of the app structure
	app := backend.NewApp(logFilePath)

	logger, err := NewFileLogger(logFilePath)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Logging to %s\n", logFilePath)

	// Create application with options
	err = wails.Run(&options.App{
		Title:  "thermo-convert",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: bundled,
		},
		BackgroundColour: &options.RGBA{R: 255, G: 255, B: 255, A: 1},
		OnStartup:        app.Startup,
		Bind: []interface{}{
			app,
		},
		Logger: logger,
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
