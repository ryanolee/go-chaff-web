import { Group, Panel, Separator } from 'react-resizable-panels';
import './App.css';
import { JsonSchemaEditor } from './components/JsonSchemaEditor';
import { JsonSchemaOutput } from './components/JsonSchemaOutput';
import { Navbar } from './components/Navbar';
import { useRef, useState } from 'react';
import { useGoChaff } from './hooks/useGoChaff';
import { useEditorState } from './hooks/useEditorState';
import { OptionsForm } from './components/OptionsForm';
import type { GoChaffGeneratorConfig } from '@go/types/GoChaffOptions';

function App() {
  const { editorValue, handleEditorChange } = useEditorState();
  const [outputValue, setOutputValue] = useState<object>({});
  const optsRef = useRef<GoChaffGeneratorConfig | undefined>(undefined);
  const goChaff = useGoChaff();

  const handleProcess = async () => {
    console.log(optsRef.current)
    try {
      const result = await goChaff({schema: editorValue, opts: optsRef.current!});
     
      console.log("Output from GoChaff:", result);
      setOutputValue(result);
    } catch (error) {
      setOutputValue({error: (error as Error).message});
    }
  }

  return (
    <div style={{height: "100vh", display: "flex", flexDirection: "column"}}>
      <Navbar onGenerateClick={handleProcess} />
      <Group orientation="vertical" style={{flex: 1}}>
        <Panel className='panel'>
          <Group orientation="horizontal">
            <Panel className='panel'><JsonSchemaEditor value={editorValue} onChange={handleEditorChange} /></Panel>
            <Separator className='separator'/>
            <Panel className='panel'><JsonSchemaOutput src={outputValue}/></Panel>
          </Group>
        </Panel>
        <Separator className='separator'/>
        <Panel className='panel'>
          <OptionsForm onChange={(data) => { optsRef.current = data; }} />
        </Panel>
      </Group>
    </div>
  );
}

export default App;