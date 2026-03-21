type Listener = () => void;

interface ProgressState {
  loaded: number;
  total: number;
  percentage: number;
}

let state: ProgressState = { loaded: 0, total: 0, percentage: 0 };
const listeners = new Set<Listener>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export const wasmProgressStore = {
  getSnapshot: (): ProgressState => state,
  subscribe: (listener: Listener): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  update: (loaded: number, total: number) => {
    state = {
      loaded,
      total,
      percentage: total > 0 ? Math.min((loaded / total) * 100, 100) : 0,
    };
    emitChange();
  },
};

export async function fetchWithProgress(url: string | URL | Request): Promise<Response> {
  const response = await fetch(url);
  const contentLength = response.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;

  if (!response.body || !total) {
    wasmProgressStore.update(total, total);
    return response;
  }

  const reader = response.body.getReader();
  const chunks: BlobPart[] = [];
  let loaded = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    wasmProgressStore.update(loaded, total);
  }

  const blob = new Blob(chunks);
  return new Response(blob, {
    headers: response.headers,
    status: response.status,
    statusText: response.statusText,
  });
}
