import { useState, type ReactNode } from 'react';
import './StatusPill.css';

export interface StatusPillItem {
  key: string;
  label: string;
  detail: string;
}

export interface StatusPillProps {
  variant: 'error' | 'success';
  count: number;
  items: StatusPillItem[];
  title: string;
  icon?: ReactNode;
  emptyMessage?: string;
  open?: boolean;
  onToggle?: (open: boolean) => void;
}

const WarningIcon = () => (
  <svg className="status-pill__icon" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1.5a.75.75 0 0 1 .65.38l6.25 10.75A.75.75 0 0 1 14.25 14H1.75a.75.75 0 0 1-.65-1.12L7.35 1.88A.75.75 0 0 1 8 1.5zM7.25 10v1.5h1.5V10h-1.5zm0-4.5V9h1.5V5.5h-1.5z"/>
  </svg>
);

const CheckIcon = () => (
  <svg className="status-pill__icon" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.27 10.87L3.47 8.07l-.94.94 3.74 3.74 8-8-.94-.94z"/>
  </svg>
);

export const StatusPill = ({ variant, count, items, title, icon, emptyMessage, open: controlledOpen, onToggle }: StatusPillProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (next: boolean) => {
    if (isControlled) {
      onToggle?.(next);
    } else {
      setInternalOpen(next);
    }
  };

  const defaultIcon = variant === 'error' ? <WarningIcon /> : <CheckIcon />;
  const displayIcon = icon ?? defaultIcon;
  const hasDropdown = items.length > 0 || !!emptyMessage;

  return (
    <div className="status-pill-container">
      <button
        className={`status-pill status-pill--${variant}`}
        onClick={() => hasDropdown && setOpen(!open)}
      >
        {displayIcon}
        {count}
      </button>
      {open && hasDropdown && (
        <div className="status-pill__dropdown">
          <div className={`status-pill__header status-pill__header--${variant}`}>
            <span>{title}</span>
            <button onClick={() => setOpen(false)} aria-label="Close">✕</button>
          </div>
          {items.length > 0 ? (
            <ul className="status-pill__list">
              {items.map((item) => (
                <li key={item.key}>
                  <code>{item.label}</code>
                  <span>{item.detail}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="status-pill__empty">{emptyMessage}</div>
          )}
        </div>
      )}
    </div>
  );
};
