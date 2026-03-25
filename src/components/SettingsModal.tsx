import { type ReactNode } from 'react';
import { Modal } from './Modal';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const SettingsModal = ({ open, onClose, children }: SettingsModalProps) => {
  return (
    <Modal open={open} onClose={onClose} title="Settings">
      {children}
    </Modal>
  );
};
