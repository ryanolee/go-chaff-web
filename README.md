# Go Chaff Web

> **[chaff.ryan.gd](https://chaff.ryan.gd)**

A browser-based playground for [go-chaff](https://github.com/ryanolee/go-chaff). Paste a JSON Schema, hit **Generate**, and get fake data back — all client-side via WebAssembly.

> **Note:** This playground is intended for quick experimentation. For actual use use, integrate the [go-chaff](https://github.com/ryanolee/go-chaff) library directly.

## Development

Requires **Node.js** ≥ 18, **Yarn** (v1), and **Go** ≥ 1.25.

```bash
yarn install
yarn dev          # compiles WASM, generates types, starts Vite on :3000
```

```bash
yarn build        # production build → dist/
```

## License

See the [go-chaff](https://github.com/ryanolee/go-chaff) repository for library licensing.
