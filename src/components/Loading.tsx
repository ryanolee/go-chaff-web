import { useSyncExternalStore } from 'react';
import { wasmProgressStore } from '../hooks/wasmProgressStore';
import logoImg from '/static/img/logo.png';
import './Loading.css';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export const Loading = () => {
  const { loaded, total, percentage, isCompressed } = useSyncExternalStore(
    wasmProgressStore.subscribe,
    wasmProgressStore.getSnapshot,
  );

  const hasProgress = total > 0;

  return (
    <div className="loading">
      <div className="loading__card">
        <img
          className="loading__mascot"
          src={logoImg}
          alt="Go Chaff mascot"
        />
        <div className="loading__info">
          <span className="loading__title">Loading Go Chaff&hellip;</span>
          <div className="loading__progress">
            <div
              className="loading__progress-fill"
              style={{ width: hasProgress ? `${percentage}%` : undefined }}
            />
          </div>
          {hasProgress ? (
            <span className="loading__stats">
              {isCompressed
                ? `${formatBytes(loaded)} transferred`
                : `${formatBytes(loaded)} / ${formatBytes(total)} (${Math.round(percentage)}%)`}
            </span>
          ) : (
            <span className="loading__stats">Initializing&hellip;</span>
          )}
        </div>
      </div>
    </div>
  );
};
