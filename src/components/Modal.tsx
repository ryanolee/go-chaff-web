import { useEffect, useRef, type ReactNode } from 'react';
import './Modal.css';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export const Modal = ({ open, onClose, title, children, maxWidth }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      style={maxWidth ? { maxWidth } : undefined}
      onClick={handleBackdropClick}
      onClose={onClose}
    >
      <div className="modal__content">
        <div className="modal__header">
          <span className="modal__title">{title}</span>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="modal__body">
          {children}
        </div>
      </div>
    </dialog>
  );
};
