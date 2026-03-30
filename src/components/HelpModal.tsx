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
          <strong>⚠ Note:</strong> This playground runs in WebAssembly (WASM) and may not perfectly match the behaviour of the native Go library.
          Expect some rough edges — if you encounter anything unexpected, please confirm with the CLI first and then{' '}
          <a href="https://github.com/ryanolee/go-chaff/issues/new?assignees=&labels=bug%2C+help+wanted&template=bug_report.md&title=%5BBUG%5D+Describe+the+issue+in+detail" target="_blank" rel="noopener noreferrer">file an issue</a>.
        </div>
        <section className="help-content__section">
          <h3>What is go-chaff?</h3>
          <p>
            <strong>go-chaff</strong> is a Go library that generates fake JSON data from any
            JSON Schema. This playground lets you experiment with it directly in the browser via WebAssembly.
          </p>
        </section>
        <section className="help-content__section">
          <h3>Getting started</h3>
          <ol>
            <li>Paste or edit a <strong>JSON Schema</strong> in the left editor panel. (<a href="https://www.schemastore.org/" target="_blank" rel="noopener noreferrer">Schema Store</a> is a good place to find examples.)</li>
            <li>Optionally tweak generation options via <strong>Settings</strong> in the navbar. (Circular referencing and external document fetching must be enabled separately.)</li>
            <li>Click <strong>Generate</strong> to produce fake data matching your schema.</li>
            <li>View the output in the right panel — toggle between tree and raw JSON views.</li>
          </ol>
        </section>

        <section className="help-content__section">
          <h3>Supported schema features</h3>
          <ul>
            <li>JSON Schema Draft 2020-12</li>
            <li>All primitive types, arrays, objects, and enums</li>
            <li>String formats (email, uri, date-time, uuid, …) and regex patterns</li>
            <li>Combinators: <code>oneOf</code>, <code>anyOf</code>, <code>allOf</code>, <code>not</code>, and <code>if</code>/<code>then</code>/<code>else</code></li>
            <li>Constraints: <code>minLength</code>, <code>maxLength</code>, <code>minimum</code>, <code>maximum</code>, <code>pattern</code>, …</li>
            <li>References via <code>$ref</code> and <code>$id</code></li>
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
