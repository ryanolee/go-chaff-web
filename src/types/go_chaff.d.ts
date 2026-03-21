
declare global {
  // eslint-disable-next-line no-var
  var goChaff: (metadata: string) => Promise<string>;
}

declare module "static/main.wasm" {
  const value: string;
  export default value;
}

export {};
