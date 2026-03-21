type Listener = () => void;

interface ProgressState {
  loaded: number;
  total: number;
  percentage: number;
  /** true when Content-Length was smaller than the bytes actually received (gzip) */
  isCompressed: boolean;
}

let state: ProgressState = { loaded: 0, total: 0, percentage: 0, isCompressed: false };
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
    // When the response is gzip-encoded the Content-Length reflects the
    // compressed size but the reader yields decompressed bytes, so loaded
    // can exceed total.  Once that happens we switch to showing loaded as
    // the best-known total and estimate progress from it.
    const isCompressed = total > 0 && loaded > total;
    const effectiveTotal = isCompressed ? loaded : total;
    state = {
      loaded,
      total: effectiveTotal,
      percentage: effectiveTotal > 0 ? Math.min((loaded / effectiveTotal) * 100, 100) : 0,
      isCompressed,
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

  // Final update: use loaded as the definitive total so the bar hits 100%
  wasmProgressStore.update(loaded, loaded);

  const blob = new Blob(chunks);
  return new Response(blob, {
    headers: response.headers,
    status: response.status,
    statusText: response.statusText,
  });
}
