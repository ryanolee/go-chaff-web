/// <reference types="vite/client" />

declare module "*.wasm" {
  const src: string;
  export default src;
}