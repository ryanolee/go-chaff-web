import JsonViewer from '@microlink/react-json-view'
import { Editor } from '@monaco-editor/react'
import { useState, useMemo } from 'react'
import './JsonSchemaOutput.css'

const monacoDarkTheme = {
    base00: '#1e1e1e', // Background
    base01: '#252526', // Lighter background (sidebar, panels)
    base02: '#264f78', // Selection background
    base03: '#6a9955', // Comments
    base04: '#858585', // Dark foreground (line numbers)
    base05: '#d4d4d4', // Default foreground
    base06: '#e8e8e8', // Light foreground
    base07: '#ffffff', // Lightest foreground
    base08: '#f44747', // Variables, errors
    base09: '#b5cea8', // Numbers, booleans, constants
    base0A: '#dcdcaa', // Classes, search highlight
    base0B: '#ce9178', // Strings
    base0C: '#9cdcfe', // Support, regex, escape chars
    base0D: '#569cd6', // Functions, keywords
    base0E: '#c586c0', // Keywords, storage, selector
    base0F: '#d16969', // Deprecated
}

interface JsonSchemaOutputProps {
    src: object;
}

export const JsonSchemaOutput = ({src}: JsonSchemaOutputProps) => {
    const [rawView, setRawView] = useState(false)
    const formattedJson = useMemo(() => JSON.stringify(src, null, 2), [src])

    return (
        <div className="json-output-container">
            
            <div className="json-output-content">
                {rawView ? (
                    <Editor
                        width="100%"
                        height="100%"
                        theme="vs-dark"
                        language="json"
                        value={formattedJson}
                        options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            lineNumbers: 'on',
                            folding: true,
                            wordWrap: 'on',
                            domReadOnly: true,
                        }}
                    />
                ) : (
                    <div className="json-viewer-wrapper">
                        <JsonViewer src={src} theme={monacoDarkTheme} />
                    </div>
                )}
            </div>
            <div className="json-output-toolbar">
                <span>Tree</span>
                <label className="json-output-toggle">
                    <input
                        type="checkbox"
                        checked={rawView}
                        onChange={(e) => setRawView(e.target.checked)}
                    />
                    <span className="toggle-track" />
                </label>
                <span>Raw</span>
            </div>
        </div>
    )
}