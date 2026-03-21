//go:build codegen

package main

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"

	"github.com/invopop/jsonschema"
	"github.com/ryanolee/go-chaff-web/go/wasm/types"
)

const OUTPUT_DIR = "schemas"

// ModuleInfo represents the JSON output of `go list -m -json`
type ModuleInfo struct {
	Dir string `json:"Dir"`
}

// getModuleDir resolves the local filesystem directory for a Go module
func getModuleDir(modulePath string) (string, error) {
	cmd := exec.Command("go", "list", "-m", "-json", modulePath)
	output, err := cmd.Output()
	if err != nil {
		return "", fmt.Errorf("failed to get module info for %s: %w", modulePath, err)
	}

	var info ModuleInfo
	if err := json.Unmarshal(output, &info); err != nil {
		return "", fmt.Errorf("failed to parse module info for %s: %w", modulePath, err)
	}

	if info.Dir == "" {
		return "", fmt.Errorf("module %s has no local directory (not downloaded?)", modulePath)
	}

	return info.Dir, nil
}

// addGoCommentsFromModule resolves a module's directory and scans it for Go comments.
// It temporarily changes the working directory so that AddGoComments receives a relative
// path ("./" ), which is required for correct CommentMap key generation.
func addGoCommentsFromModule(reflector *jsonschema.Reflector, modulePath string) {
	dir, err := getModuleDir(modulePath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Warning: could not resolve module directory for %s: %v\n", modulePath, err)
		return
	}

	origDir, err := os.Getwd()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Warning: could not get working directory: %v\n", err)
		return
	}

	if err := os.Chdir(dir); err != nil {
		fmt.Fprintf(os.Stderr, "Warning: could not chdir to %s: %v\n", dir, err)
		return
	}
	defer os.Chdir(origDir)

	if err := reflector.AddGoComments(modulePath, "./"); err != nil {
		fmt.Fprintf(os.Stderr, "Warning: failed to extract comments from %s: %v\n", modulePath, err)
	}
}

func createReflector() *jsonschema.Reflector {
	reflector := &jsonschema.Reflector{
		ExpandedStruct: true,
	}

	// Scan comments from the local wasm/types module (recursively includes all subpackages)
	addGoCommentsFromModule(reflector, "github.com/ryanolee/go-chaff-web/go/wasm")

	// Scan comments from the go-chaff dependency (ParserOptions, GeneratorOptions, etc.)
	addGoCommentsFromModule(reflector, "github.com/ryanolee/go-chaff")

	return reflector
}

func main() {
	reflector := createReflector()
	writeStructToFile(reflector, types.GoChaffOptions{}, fmt.Sprintf("%s/GoChaffOptions.json", OUTPUT_DIR))
	writeStructToFile(reflector, types.GoChaffGeneratorConfig{}, fmt.Sprintf("%s/GoChaffGeneratorConfig.json", OUTPUT_DIR))
	writeStructToFile(reflector, types.GoChaffOutput{}, fmt.Sprintf("%s/GoChaffOutput.json", OUTPUT_DIR))
}

func writeStructToFile(reflector *jsonschema.Reflector, structure interface{}, filename string) error {

	schema := reflector.Reflect(structure)
	schema.ID = ""

	jsonData, err := json.MarshalIndent(schema, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal JSON schema: %w", err)
	}

	if err := os.MkdirAll(OUTPUT_DIR, os.ModePerm); err != nil {
		return fmt.Errorf("failed to create output directory: %w", err)
	}

	err = os.WriteFile(filename, jsonData, 0644)
	if err != nil {
		return fmt.Errorf("failed to write JSON schema to file: %w", err)
	}

	return nil
}
