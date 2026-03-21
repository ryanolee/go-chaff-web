import { Editor, type Monaco, type OnChange } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import metaSchema from "../schemas/2020-12.json";
import { useCallback } from "react";

const configureJsonSchemaValidation = (monaco: Monaco) => {
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemas: [
      {
        uri: "https://json-schema.org/draft/2020-12/schema",
        fileMatch: ["*"],
        schema: metaSchema,
      },
    ],
  });
};

const handleEditorMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
  // For all those users who spam the save shortcut out of reflex
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    editor.getAction("editor.action.formatDocument")?.run();
  });
};


interface JsonSchemaEditorProps {
  value?: string;
  onChange: (value: string) => void;
}

export const JsonSchemaEditor = ({value, onChange}: JsonSchemaEditorProps) => {
  const handleEditorChange: OnChange = useCallback((value) => {
    if (value) {
      onChange(value);
    }
  }, [onChange]);
  return (
    <Editor
      width="100%"
      height="100%"
      theme="vs-dark"
      language="json"
      value={value}
      onChange={handleEditorChange}
      beforeMount={configureJsonSchemaValidation}
      onMount={handleEditorMount}
      options={{
        quickSuggestions: true,
        formatOnPaste: true,
      }}
    />
  );
};
