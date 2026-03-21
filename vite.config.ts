import { defineConfig, type ViteDevServer, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import child_process from 'child_process';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { globSync, existsSync, mkdirSync } from 'fs';
import { compile} from 'json-schema-to-typescript'
import { readFile, writeFile } from 'fs/promises';

async function compileGoWasm() {
  console.log('Compiling Go code to WebAssembly...');
  const goPath = path.resolve(__dirname, 'go/wasm')
  const codegenPath = path.resolve(__dirname, 'go/codegen')
  const outDir = path.resolve(__dirname, 'static');
  const typesOutDir = path.resolve(__dirname, 'go/codegen/types');
  child_process.execSync(`GOOS=js GOARCH=wasm go build -o ${outDir}/main.wasm .`, { stdio: 'inherit', cwd: goPath });
  
  console.log('Converting Go types to JSON Schemas...');
  child_process.execSync('go run main.go', { stdio: 'inherit', cwd: codegenPath });

  console.log('Creating typescript bindings for Go-generated JSON Schemas...');
  if (!existsSync(typesOutDir)) {
    mkdirSync(typesOutDir, { recursive: true });
  }

  await Promise.all(globSync(path.resolve(codegenPath, 'schemas/**/*.json')).map(async (schemaPath) => {
    const schemaContent = await readFile(schemaPath, 'utf-8');
    const schema = JSON.parse(schemaContent);
    const tsContent = await compile(schema, path.basename(schemaPath, '.json'), { bannerComment: '' });
    const tsOutputPath = path.resolve(typesOutDir, `${path.basename(schemaPath, '.json')}.ts`);
    await writeFile(tsOutputPath, tsContent, 'utf-8');
  })).then(() => {
    console.log('TypeScript bindings generated successfully.');
  }).catch((error) => {
    console.error('Error generating TypeScript bindings:', error);
  });
  

  console.log('Go code compiled successfully.');
}

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