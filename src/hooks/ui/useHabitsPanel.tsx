
import React, { createContext, useContext, useState, ReactNode } from 'react';

type HabitsPanelContextType = {
  activePanel: string;
  setActivePanel: (panel: string) => void;
};

const HabitsPanelContext = createContext<HabitsPanelContextType | undefined>(undefined);

export const HabitsPanelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePanel, setActivePanel] = useState<string>('templates');
  
  return (
    <HabitsPanelContext.Provider value={{ activePanel, setActivePanel }}>
      {children}
    </HabitsPanelContext.Provider>
  );
};

export const useHabitsPanel = () => {
  const context = useContext(HabitsPanelContext);
  if (context === undefined) {
    throw new Error('useHabitsPanel must be used within a HabitsPanelProvider');
  }
  return context;
};
