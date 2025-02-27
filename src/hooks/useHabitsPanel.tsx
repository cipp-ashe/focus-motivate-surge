
import React, { createContext, useContext, useState } from 'react';

interface HabitsPanelContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const HabitsPanelContext = createContext<HabitsPanelContextType | undefined>(undefined);

export function HabitsPanelProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    console.log("Toggling habits panel, current state:", isOpen);
    setIsOpen(prev => !prev);
  };
  
  const open = () => {
    console.log("Opening habits panel");
    setIsOpen(true);
  };
  
  const close = () => {
    console.log("Closing habits panel");
    setIsOpen(false);
  };

  return (
    <HabitsPanelContext.Provider value={{ isOpen, toggle, open, close }}>
      {children}
    </HabitsPanelContext.Provider>
  );
}

export function useHabitsPanel() {
  const context = useContext(HabitsPanelContext);
  if (context === undefined) {
    throw new Error('useHabitsPanel must be used within a HabitsPanelProvider');
  }
  return context;
}
