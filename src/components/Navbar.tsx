import { useState } from 'react';
import logoSrc from '/static/img/logo.png';
import './Navbar.css';

interface NavbarProps {
  onGenerateClick?: () => Promise<void>;
}

export function Navbar({ onGenerateClick }: NavbarProps) {
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
        <span className="navbar-title">go-chaff</span>
      </div>
      <ul className="navbar-links">
        <li><a href="#playground" className="navbar-link active">Playground</a></li>
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
