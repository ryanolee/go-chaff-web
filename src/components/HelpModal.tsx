import { Modal } from './Modal';
import './HelpModal.css';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export const HelpModal = ({ open, onClose }: HelpModalProps) => {
  return (
    <Modal open={open} onClose={onClose} title="Help" maxWidth="600px">
      <div className="help-content">
        <div className="help-content__disclaimer">
          <strong>⚠ WASM Disclaimer:</strong> This playground runs go-chaff via WebAssembly, which may result in
          inaccurate output compared to running it natively in Go — especially around number handling
          (e.g. floating-point precision, integer boundaries). Run the same schema with the go-chaff CLI if you run into issues.
        </div>

        <section className="help-content__section">
          <h3>What is go-chaff?</h3>
          <p>
            <strong>go-chaff</strong> is a Go library that generates realistic fake JSON data from any
            JSON Schema. This playground lets you experiment with it directly in the browser via WebAssembly.
          </p>
        </section>

        <section className="help-content__section">
          <h3>Getting started</h3>
          <ol>
            <li>Paste or edit a <strong>JSON Schema</strong> in the left editor panel.</li>
            <li>Optionally tweak generation options via the <strong>Settings</strong> pill in the navbar.</li>
            <li>Click <strong>Generate</strong> to produce fake data matching your schema.</li>
            <li>View the output in the right panel — toggle between tree and raw JSON views.</li>
          </ol>
        </section>

        <section className="help-content__section">
          <h3>Supported schema features</h3>
          <ul>
            <li>JSON Schema Draft 2020-12</li>
            <li>All primitive types, arrays, objects, enums</li>
            <li>String formats (email, uri, date-time, uuid, …)</li>
            <li>Combinators: <code>oneOf</code>, <code>anyOf</code>, <code>allOf</code></li>
            <li>Constraints: <code>minLength</code>, <code>maxLength</code>, <code>minimum</code>, <code>maximum</code>, <code>pattern</code>, …</li>
            <li>References via <code>$ref</code></li>
            <li>external documentation via <code>description</code> and <code>examples</code></li>
          </ul>
        </section>

        <section className="help-content__section">
          <h3>Keyboard shortcuts</h3>
          <table className="help-content__shortcuts">
            <tbody>
              <tr><td><kbd>Ctrl</kbd> + <kbd>S</kbd></td><td>Format JSON in the editor</td></tr>
            </tbody>
          </table>
        </section>

        <section className="help-content__section">
          <h3>Links</h3>
          <ul>
            <li><a href="https://github.com/ryanolee/go-chaff" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
            <li><a href="https://pkg.go.dev/github.com/ryanolee/go-chaff" target="_blank" rel="noopener noreferrer">Go Package Docs</a></li>
            <li><a href="https://json-schema.org/specification" target="_blank" rel="noopener noreferrer">JSON Schema Specification</a></li>
          </ul>
        </section>
      </div>
    </Modal>
  );
};
