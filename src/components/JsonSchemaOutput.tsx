import JsonViewer from '@microlink/react-json-view'
import { Editor } from '@monaco-editor/react'
import { useState, useMemo } from 'react'
import type { GoChaffOutput } from '@go/types/GoChaffOutput'
import { StatusPill, type StatusPillItem } from './StatusPill'
import { useSchemaValidation } from '../hooks/useSchemaValidation'
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
    output: GoChaffOutput | null;
    schema: string;
}

type OpenPill = 'errors' | 'validation' | null

export const JsonSchemaOutput = ({output, schema}: JsonSchemaOutputProps) => {
    const [rawView, setRawView] = useState(true)
    const [openPill, setOpenPill] = useState<OpenPill>(null)
    const result = output?.result ?? null
    const src = (typeof result === 'object' && result !== null ? result : { root: result }) as Record<string, unknown>
    const formattedJson = useMemo(() => JSON.stringify(result, null, 2), [result])

    const errorItems: StatusPillItem[] = useMemo(
        () => Object.entries(output?.errors ?? {}).map(([path, msg]) => ({ key: path, label: path, detail: msg })),
        [output?.errors]
    )

    const validation = useSchemaValidation(schema, result)
    const validationItems: StatusPillItem[] = useMemo(
        () => (validation?.errors ?? []).map((err, i) => ({ key: `${err.path}-${i}`, label: err.path, detail: err.message })),
        [validation?.errors]
    )

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
                        <JsonViewer src={src} theme={monacoDarkTheme} name={false} />
                    </div>
                )}
            </div>
            <div className="json-output-toolbar">
                <div className="json-output-toolbar__left">
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
                {output && (
                    <div className="json-output-toolbar__stats">
                        <span>compile <strong>{output.compilationTimeMs === 0 ? '<1' : output.compilationTimeMs}ms</strong></span>
                        <span>generate <strong>{output.generationTimeMs === 0 ? '<1' : output.generationTimeMs}ms</strong></span>
                        {errorItems.length > 0 && (
                            <StatusPill
                                variant="error"
                                count={errorItems.length}
                                items={errorItems}
                                title="Generation Errors"
                                open={openPill === 'errors'}
                                onToggle={(v) => setOpenPill(v ? 'errors' : null)}
                            />
                        )}
                        {validation && (
                            validation.valid ? (
                                <StatusPill
                                    variant="success"
                                    count={0}
                                    items={[]}
                                    title="Schema Validation"
                                    emptyMessage="Generated output matches the schema"
                                    open={openPill === 'validation'}
                                    onToggle={(v) => setOpenPill(v ? 'validation' : null)}
                                />
                            ) : (
                                <StatusPill
                                    variant="error"
                                    count={validationItems.length}
                                    items={validationItems}
                                    title="Validation Errors"
                                    open={openPill === 'validation'}
                                    onToggle={(v) => setOpenPill(v ? 'validation' : null)}
                                />
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}