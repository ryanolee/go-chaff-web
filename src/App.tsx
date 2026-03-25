import { Group, Panel, Separator } from 'react-resizable-panels';
import './App.css';
import { JsonSchemaEditor } from './components/JsonSchemaEditor';
import { JsonSchemaOutput } from './components/JsonSchemaOutput';
import { Navbar } from './components/Navbar';
import { useRef, useState } from 'react';
import { useGoChaff } from './hooks/useGoChaff';
import { useEditorState } from './hooks/useEditorState';
import { OptionsForm } from './components/OptionsForm';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { Footer } from './components/Footer';
import type { GoChaffGeneratorConfig } from '@go/types/GoChaffOptions';
import type { GoChaffOutput } from '@go/types/GoChaffOutput';

function App() {
  const { editorValue, handleEditorChange } = useEditorState();
  const [outputValue, setOutputValue] = useState<GoChaffOutput | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const optsRef = useRef<GoChaffGeneratorConfig | undefined>(undefined);
  const goChaff = useGoChaff();

  const handleProcess = async () => {

    try {
      console.log("[GoChaff] Processing with schema and options:", editorValue, optsRef.current);
      const result = await goChaff({schema: editorValue, opts: optsRef.current!});
     
      console.log("[GoChaff] Received result:", result);
      setOutputValue(result);
    } catch (error) {
      setOutputValue({result: null, errors: {error: (error as Error).message}, generationTimeMs: 0, compilationTimeMs: 0});
    }
  }

  return (
    <div style={{height: "100vh", display: "flex", flexDirection: "column"}}>
      <Navbar onGenerateClick={handleProcess} onSettingsClick={() => setSettingsOpen(true)} onHelpClick={() => setHelpOpen(true)} />
      <Group orientation="horizontal" style={{flex: 1}}>
        <Panel className='panel'><JsonSchemaEditor value={editorValue} onChange={handleEditorChange} /></Panel>
        <Separator className='separator'/>
        <Panel className='panel'><JsonSchemaOutput output={outputValue} schema={editorValue}/></Panel>
      </Group>
      <Footer />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <OptionsForm onChange={(data) => { optsRef.current = data; }} />
      </SettingsModal>
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}

export default App;