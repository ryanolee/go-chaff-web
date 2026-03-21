import { createContext, use, type ReactNode } from "react";
import goWasm from "/static/main.wasm";
import { fetchWithProgress } from "./wasmProgressStore";
import type { GoChaffOptions } from "@go/types/GoChaffOptions";
import type { GoChaffOutput } from "@go/types/GoChaffOutput";


const GoChaffContext = createContext<typeof handleGoChaffCall | null>(null);



const handleGoChaffCall = async (options: GoChaffOptions): Promise<GoChaffOutput> => {
  const result = await goChaff(JSON.stringify(options))

  try {
    return JSON.parse(result);
  } catch (error) {
    throw new Error(`Failed to parse GoChaff output: ${(error as Error).message}`);
  }   
}


const go = new Go();
const wasmPromise = WebAssembly.instantiateStreaming(fetchWithProgress(goWasm), go.importObject)
  .then((result) => {
    go.run(result.instance);
    // Gochaff should now be available on the global scope thanks to wasm_exec.js
    return handleGoChaffCall
  });

export const GoChaffProvider = ({children}: {children: ReactNode}) => {
  const func = use(wasmPromise);
  return (
    <GoChaffContext.Provider value={func}>
      {children}
    </GoChaffContext.Provider>
  )
}

export const useGoChaff = () => {
  const context = use(GoChaffContext);
  if (!context) {
    throw new Error("useGoChaff must be used within a GoChaffProvider");
  }
  return context;
}

