package backend

import (
	"os"
	"path/filepath"
	"reflect"
	"testing"
)

func TestMatchingFiles(t *testing.T) {
	directory := t.TempDir()
	for _, name := range []string{"a.JPG", "b.jpeg", "ignored.png"} {
		if err := os.WriteFile(filepath.Join(directory, name), nil, 0o600); err != nil {
			t.Fatal(err)
		}
	}
	if err := os.Mkdir(filepath.Join(directory, "nested"), 0o700); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(directory, "nested", "c.jpg"), nil, 0o600); err != nil {
		t.Fatal(err)
	}

	got, err := matchingFiles(directory, inputFilePattern)
	if err != nil {
		t.Fatal(err)
	}
	want := []string{
		filepath.Join(directory, "a.JPG"),
		filepath.Join(directory, "b.jpeg"),
	}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("matchingFiles() = %v, want %v", got, want)
	}
}
