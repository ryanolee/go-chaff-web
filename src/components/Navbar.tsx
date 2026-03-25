import { useState } from 'react';
import logoSrc from '/static/img/logo.png';
import './Navbar.css';

interface NavbarProps {
  onGenerateClick?: () => Promise<void>;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
}

export function Navbar({ onGenerateClick, onSettingsClick, onHelpClick }: NavbarProps) {
  const [generating, setGenerating] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (generating || !onGenerateClick) return;
    setGenerating(true);
    try {
      await onGenerateClick();
    } finally {
      setGenerating(false);
    }
  };

  const generateClasses = [
    'navbar-link',
    'navbar-link--generate',
    generating && 'navbar-link--generate-loading',
  ].filter(Boolean).join(' ');

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logoSrc} alt="go-chaff logo" className="navbar-logo" />
        <span className="navbar-title">go-chaff Playground</span>
      </div>
      <ul className="navbar-links">
        <li><a href="https://pkg.go.dev/github.com/ryanolee/go-chaff" target="_blank" rel="noopener noreferrer" className="navbar-link">Docs</a></li>
        <li>
          <a
            href="#help"
            onClick={(e) => { e.preventDefault(); onHelpClick?.(); }}
            className="navbar-link"
          >
            <svg className="navbar-link__icon" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 12.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zM9.5 8.4c-.5.4-.75.6-.75 1.1a.75.75 0 0 1-1.5 0c0-1.15.7-1.7 1.25-2.12C8.88 7.1 9.25 6.8 9.25 6.25a1.25 1.25 0 0 0-2.5 0 .75.75 0 0 1-1.5 0 2.75 2.75 0 0 1 5.5 0c0 1.15-.7 1.7-1.25 2.15z"/>
            </svg>
            Help
          </a>
        </li>
        <li>
          <a
            href="#settings"
            onClick={(e) => { e.preventDefault(); onSettingsClick?.(); }}
            className="navbar-link"
          >
            <svg className="navbar-link__icon" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.1 2H6.9L6.5 3.7a4.7 4.7 0 0 0-1.2.7L3.7 3.8 2.6 5.7l1.3 1.1a4.8 4.8 0 0 0 0 1.4L2.6 9.3l1.1 1.9 1.6-.6c.4.3.8.5 1.2.7L6.9 13h2.2l.4-1.7c.4-.2.8-.4 1.2-.7l1.6.6 1.1-1.9-1.3-1.1a4.8 4.8 0 0 0 0-1.4l1.3-1.1-1.1-1.9-1.6.6a4.7 4.7 0 0 0-1.2-.7L9.1 2zM8 10a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
            </svg>
            Settings
          </a>
        </li>
        <li>
          <a
            href="https://github.com/ryanolee/go-chaff"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-link"
            aria-label="GitHub"
          >
            <svg className="navbar-link__icon" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </a>
        </li>
        <li>
          <a
            href="#generate"
            onClick={handleClick}
            className={generateClasses}
            aria-disabled={generating}
          >
            {generating && <span className="navbar-link__spinner" />}
            {generating ? 'Generating\u2026' : 'Generate'}
          </a>
        </li>
      </ul>
    </nav>
  );
}
