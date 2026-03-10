import { useEffect, useState } from "react";

interface UseEditPanelResult {
  editMode: boolean;
  confirmOpen: boolean;
  startEdit: () => void;
  requestClose: (saveFn?: () => void) => void;
  handleDiscard: () => void;
  handleSaveConfirm: (saveFn?: () => void) => void;
  handleSave: () => void;
  handleCancel: () => void;
  setConfirmOpen: (open: boolean) => void;
}

export const useEditPanel = (open: boolean, onClose: () => void): UseEditPanelResult => {
  const [editMode, setEditMode] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setEditMode(false);
      setConfirmOpen(false);
    }
  }, [open]);

  const startEdit = (): void => setEditMode(true);

  const requestClose = (): void => {
    if (editMode) {
      setConfirmOpen(true);
      return;
    }
    onClose();
  };

  const handleDiscard = (): void => {
    setConfirmOpen(false);
    setEditMode(false);
    onClose();
  };

  const handleSaveConfirm = (saveFn?: () => void): void => {
    setConfirmOpen(false);
    if (saveFn) {
      saveFn();
    }
    setEditMode(false);
  };

  const handleSave = (): void => {
    setEditMode(false);
  };

  const handleCancel = (): void => {
    if (editMode) {
      setConfirmOpen(true);
      return;
    }
    onClose();
  };

  return {
    editMode,
    confirmOpen,
    startEdit,
    requestClose,
    handleDiscard,
    handleSaveConfirm,
    handleSave,
    handleCancel,
    setConfirmOpen,
  };
};
