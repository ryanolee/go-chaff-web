import { defineConfig, type ViteDevServer, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import child_process from 'child_process';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { globSync, existsSync, mkdirSync } from 'fs';
import { compile} from 'json-schema-to-typescript'
import { readFile, writeFile } from 'fs/promises';

const goWasmDir = path.resolve(__dirname, 'go/wasm');
const codegenDir = path.resolve(__dirname, 'go/codegen');
const wasmOutDir = path.resolve(__dirname, 'static');
const typesOutDir = path.resolve(__dirname, 'go/codegen/types');

function buildWasmBinary() {
  console.log('Compiling Go code to WebAssembly...');
  child_process.execSync(
    `GOOS=js GOARCH=wasm go build -o ${wasmOutDir}/main.wasm .`,
    { stdio: 'inherit', cwd: goWasmDir },
  );
}

function generateJsonSchemas() {
  console.log('Converting Go types to JSON Schemas...');
  child_process.execSync('go run main.go', { stdio: 'inherit', cwd: codegenDir });
}

async function generateTypeScriptBindings() {
  console.log('Creating TypeScript bindings for Go-generated JSON Schemas...');
  if (!existsSync(typesOutDir)) {
    mkdirSync(typesOutDir, { recursive: true });
  }

  const schemaFiles = globSync(path.resolve(codegenDir, 'schemas/**/*.json'));
  await Promise.all(schemaFiles.map(async (schemaPath) => {
    const schemaContent = await readFile(schemaPath, 'utf-8');
    const schema = JSON.parse(schemaContent);
    const tsContent = await compile(schema, path.basename(schemaPath, '.json'), { bannerComment: '' });
    const tsOutputPath = path.resolve(typesOutDir, `${path.basename(schemaPath, '.json')}.ts`);
    await writeFile(tsOutputPath, tsContent, 'utf-8');
  }));
  console.log('TypeScript bindings generated successfully.');
}

async function compileGoWasm() {
  buildWasmBinary();
  generateJsonSchemas();
  await generateTypeScriptBindings();
  console.log('Go code compiled successfully.');
}

const goChaffVersion = child_process
  .execSync(`go list -m all | grep github.com/ryanolee/go-chaff | awk '{print $2}'`, { cwd: goWasmDir })
  .toString()
  .trim();
const buildDate = new Date().toISOString().split('T')[0];
console.log(`Running go chaff version: ${goChaffVersion}`);

const compileGoWasmPlugin: Plugin = {
  name: 'compile-go-wasm',
  async buildStart() {
    try {
      await compileGoWasm();
    } catch (error) {
      console.error('Error compiling Go code:', error);
      process.exit(1);
    }
  },
  configureServer(server: ViteDevServer) {
    const goFiles = [
      globSync(path.resolve(__dirname, 'go/wasm/**/*.go')).map(file => path.resolve(file)),
      globSync(path.resolve(__dirname, 'go/codegen/*.go')).map(file => path.resolve(file)),
      path.resolve(__dirname, 'go/workspace/go.work'),
    ].flat();

    server.watcher.add(goFiles);

    server.watcher.on('change', (changedPath: string) => {
      if (changedPath.endsWith('.go') || changedPath.endsWith('go.mod')) {
        console.log(`Go file changed: ${changedPath}`);
        try {
          compileGoWasm();
          server.ws.send({ type: 'full-reload' });
        } catch (error) {
          console.error('Error recompiling Go code:', error);
        }
      }
    });
  },
}

export default defineConfig({
  plugins: [react(), tailwindcss(), compileGoWasmPlugin],
  define: {
    __GO_CHAFF_VERSION__: JSON.stringify(goChaffVersion),
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
  assetsInclude: ['static/main.wasm'],
  resolve: {
    alias: {
      '@go': path.resolve(__dirname, 'go/codegen'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
})