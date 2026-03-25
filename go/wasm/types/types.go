package types

import "github.com/ryanolee/go-chaff"

type (
	GoChaffOptions struct {
		Hash   string                 `json:"-"`
		Schema string                 `json:"schema"`
		Opts   GoChaffGeneratorConfig `json:"opts"`
	}

	GoChaffGeneratorConfig struct {
		ParserOptions    chaff.ParserOptions    `json:"parserOptions"`
		GeneratorOptions chaff.GeneratorOptions `json:"generatorOptions"`
	}

	GoChaffOutput struct {
		Result            interface{}       `json:"result"`
		Errors            map[string]string `json:"errors"`
		GenerationTimeMs  float64           `json:"generationTimeMs"`
		CompilationTimeMs float64           `json:"compilationTimeMs"`
	}
)
