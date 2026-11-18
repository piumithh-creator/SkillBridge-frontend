import { Button } from "./Button";
import { Modal } from "./Modal";

interface Props { open: boolean; title: string; message: string; confirmLabel?: string; loading?: boolean; onConfirm: () => void; onCancel: () => void }

export const ConfirmDialog = ({ open, title, message, confirmLabel = "Confirm", loading, onConfirm, onCancel }: Props) => (
  <Modal open={open} onClose={onCancel} title={title}>
    <p className="text-sm text-slate-600">{message}</p>
    <div className="mt-6 flex justify-end gap-2">
      <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      <Button variant="danger" isLoading={loading} onClick={onConfirm}>{confirmLabel}</Button>
    </div>
  </Modal>
);
