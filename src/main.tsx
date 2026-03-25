import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { GoChaffProvider } from './hooks/useGoChaff';
import { Loading } from './components/Loading';
import { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

loader.config({ monaco });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<Loading />}>
      <GoChaffProvider>
        <App />
      </GoChaffProvider>
    </Suspense>
  </StrictMode>,
);  