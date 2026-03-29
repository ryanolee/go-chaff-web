package main

import (
	_ "crypto/sha512"
	"encoding/json"
	"hash/crc64"
	"math"
	"strconv"
	"syscall/js"
	"time"

	"github.com/ryanolee/go-chaff"
	"github.com/ryanolee/go-chaff-web/go/wasm/types"
)

const MAX_CACHE_SIZE = 30

type (
	compilerMetadata struct {
		generator         *chaff.RootGenerator
		compilationTimeMs float64
	}
	compiledSchemaRegistry struct {
		schemas map[string]*compilerMetadata
	}
)

var registry = compiledSchemaRegistry{
	schemas: make(map[string]*compilerMetadata),
}
var table = crc64.MakeTable(crc64.ECMA)

func (r *compiledSchemaRegistry) GetOrCompile(opts *types.GoChaffOptions) (*compilerMetadata, error) {
	// Clear the cache if it exceeds the maximum size to prevent memory bloat
	if len(r.schemas) > MAX_CACHE_SIZE {
		r.schemas = make(map[string]*compilerMetadata)
	}

	if generator, exists := r.schemas[opts.Hash]; exists {
		return generator, nil
	}

	// Force a default not requiring FS access since that's not available in WASM
	if opts.Opts.ParserOptions.RelativeTo == "" {
		opts.Opts.ParserOptions.RelativeTo = "schema://go-chaff-web/"
	}

	compileTimeStart := time.Now().UnixNano()
	generator, err := chaff.ParseSchemaString(opts.Schema, &opts.Opts.ParserOptions)
	compileTime := time.Now().UnixNano() - compileTimeStart
	compilerMetadata := compilerMetadata{
		generator:         &generator,
		compilationTimeMs: math.Round(float64(compileTime)/float64(time.Millisecond)*100) / 100,
	}
	if err != nil {
		return &compilerMetadata, err
	}

	r.schemas[opts.Hash] = &compilerMetadata
	return &compilerMetadata, nil
}

func main() {
	done := make(chan struct{})
	js.Global().Set("goChaff", js.FuncOf(handleGoChaffInPromise))
	<-done
}

func jsError(msg string) js.Value {
	return js.Global().Get("Error").New(msg)
}

func handleGoChaffInPromise(this js.Value, args []js.Value) interface{} {
	// Create and return the Promise object
	promiseConstructor := js.Global().Get("Promise")
	return promiseConstructor.New(js.FuncOf(func(this js.Value, promiseArgs []js.Value) interface{} {
		resolve := promiseArgs[0]
		reject := promiseArgs[1]

		go goChaff(resolve, reject, args)
		return nil
	}))
}

func unmarshalGoChaffOptions(opts string) (*types.GoChaffOptions, error) {
	var goChaffOptions types.GoChaffOptions
	err := json.Unmarshal([]byte(opts), &goChaffOptions)
	if err != nil {
		return nil, err
	}

	goChaffOptions.Hash = strconv.FormatUint(crc64.Checksum([]byte(opts), table), 10)

	return &goChaffOptions, nil
}

func goChaff(res js.Value, rej js.Value, args []js.Value) {
	if len(args) == 0 {
		rej.Invoke(jsError("No schema provided"))
		return
	}

	opts, err := unmarshalGoChaffOptions(args[0].String())
	if err != nil {
		rej.Invoke(jsError("Failed to parse options: " + err.Error()))
		return
	}

	generatorMetadata, err := registry.GetOrCompile(opts)
	if err != nil {
		rej.Invoke(jsError("Failed to compile schema: " + err.Error()))
		return
	}

	generationTimeStart := time.Now().UnixNano()
	result := generatorMetadata.generator.Generate(&opts.Opts.GeneratorOptions)
	generationTime := time.Now().UnixNano() - generationTimeStart

	output := types.GoChaffOutput{
		Result:            result,
		Errors:            collectErrors(generatorMetadata.generator),
		GenerationTimeMs:  math.Round(float64(generationTime)/float64(time.Millisecond)*100) / 100,
		CompilationTimeMs: generatorMetadata.compilationTimeMs,
	}

	jsonBytes, err := json.Marshal(output)
	if err != nil {
		rej.Invoke(jsError("Failed to serialize output: " + err.Error()))
		return
	}

	res.Invoke(string(jsonBytes))
}

func collectErrors(generator *chaff.RootGenerator) map[string]string {
	if generator.Metadata == nil {
		return nil
	}

	errors := make(map[string]string)
	for path, err := range generator.Metadata.Errors.CollectErrors() {
		errors[path] = err.Error()
	}
	return errors
}
