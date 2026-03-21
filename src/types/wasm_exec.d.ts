/**
 * Type definitions for Go WebAssembly support (wasm_exec.js)
 *
 * @see https://github.com/golang/go/blob/master/misc/wasm/wasm_exec.js
 */

declare class Go {
  /** Command-line arguments passed to the Go program. Defaults to `["js"]`. */
  argv: string[];

  /** Environment variables available to the Go program. */
  env: Record<string, string>;

  /**
   * Callback invoked when the Go program exits.
   * @param code - The exit code. `0` indicates success.
   */
  exit: (code: number) => void;

  /**
   * The WebAssembly import object to pass to `WebAssembly.instantiate`
   * or `WebAssembly.instantiateStreaming`.
   */
  importObject: WebAssembly.Imports;

  /** Whether the Go program has exited. */
  exited: boolean;

  /**
   * Runs the Go WebAssembly instance. Resolves when the program exits.
   * @param instance - A compiled and instantiated WebAssembly instance.
   */
  run(instance: WebAssembly.Instance): Promise<void>;
}

declare global {
  // eslint-disable-next-line no-var
  var Go: typeof Go;
}

export {};
