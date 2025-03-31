
import React, { createContext, useContext, useState, useCallback } from 'react';

interface NotesPanelContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const NotesPanelContext = createContext<NotesPanelContextType | undefined>(undefined);

export function NotesPanelProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    console.log("Toggling notes panel, current state:", !isOpen);
    setIsOpen(prev => !prev);
  }, [isOpen]);
  
  const open = useCallback(() => {
    console.log("Opening notes panel");
    setIsOpen(true);
  }, []);
  
  const close = useCallback(() => {
    console.log("Closing notes panel");
    setIsOpen(false);
  }, []);

  return (
    <NotesPanelContext.Provider value={{ 
      isOpen, 
      toggle, 
      open, 
      close
    }}>
      {children}
    </NotesPanelContext.Provider>
  );
}

export function useNotesPanel() {
  const context = useContext(NotesPanelContext);
  if (context === undefined) {
    throw new Error('useNotesPanel must be used within a NotesPanelProvider');
  }
  return context;
}
