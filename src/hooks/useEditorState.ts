import { useCallback, useState } from 'react';

const STORAGE_KEY = 'go-chaff:editor-value';

function getInitialEditorValue(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '{}';
  } catch {
    return '{}';
  }
}

export const useEditorState = () => {
  const [editorValue, setEditorValue] = useState(getInitialEditorValue);

  const handleEditorChange = useCallback((value: string) => {
    setEditorValue(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch { }
  }, []);

  return { editorValue, handleEditorChange } as const;
};
