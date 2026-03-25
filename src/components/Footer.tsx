import { GO_CHAFF_VERSION, BUILD_DATE } from '../buildInfo';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <span className="footer__text">
        go-chaff <strong>{GO_CHAFF_VERSION}</strong> · built {BUILD_DATE}
      </span>
    </footer>
  );
}
