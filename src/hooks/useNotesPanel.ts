
import { useState, useCallback } from 'react';

export interface UseNotesPanelReturn {
  isOpen: boolean;
  activeNoteId: string | null;
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
  setActiveNoteId: (id: string) => void;
}

/**
 * Hook for managing the notes panel state
 */
export const useNotesPanel = (): UseNotesPanelReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const togglePanel = useCallback(() => {
    setIsOpen(prev => !prev);
    if (isOpen) {
      // Clear active note when closing panel
      setActiveNoteId(null);
    }
  }, [isOpen]);

  const openPanel = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    setActiveNoteId(null);
  }, []);

  const handleSetActiveNoteId = useCallback((id: string) => {
    setActiveNoteId(id);
    setIsOpen(true); // Always open the panel when setting an active note
  }, []);

  return {
    isOpen,
    activeNoteId,
    togglePanel,
    openPanel,
    closePanel,
    setActiveNoteId: handleSetActiveNoteId
  };
};
