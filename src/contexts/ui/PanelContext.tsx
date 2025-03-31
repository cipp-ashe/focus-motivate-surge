
import React, { createContext, useContext, useState, useCallback } from 'react';

// Define panel types for the application
export type PanelType = 'notes' | 'habits' | 'tasks' | 'settings';

// Panel context interface
interface PanelContextType {
  // Currently open panel (if any)
  openPanel: PanelType | null;
  
  // Panel state tracking
  isPanelOpen: (panel: PanelType) => boolean;
  
  // Panel actions
  openPanel: (panel: PanelType) => void;
  closePanel: () => void;
  togglePanel: (panel: PanelType) => void;
}

// Create the context
const PanelContext = createContext<PanelContextType | undefined>(undefined);

export function PanelProvider({ children }: { children: React.ReactNode }) {
  // Track which panel is currently open (null means no panel is open)
  const [activePanel, setActivePanel] = useState<PanelType | null>(null);

  // Check if a specific panel is open
  const isPanelOpen = useCallback((panel: PanelType): boolean => {
    return activePanel === panel;
  }, [activePanel]);

  // Open a specific panel
  const openPanel = useCallback((panel: PanelType) => {
    console.log(`Opening ${panel} panel`);
    setActivePanel(panel);
  }, []);

  // Close the currently open panel
  const closePanel = useCallback(() => {
    console.log(`Closing ${activePanel} panel`);
    setActivePanel(null);
  }, [activePanel]);

  // Toggle a specific panel
  const togglePanel = useCallback((panel: PanelType) => {
    console.log(`Toggling ${panel} panel, current state: ${activePanel === panel ? 'open' : 'closed'}`);
    setActivePanel(prev => prev === panel ? null : panel);
  }, [activePanel]);

  // Provide the context value
  return (
    <PanelContext.Provider value={{ 
      openPanel: activePanel,
      isPanelOpen,
      openPanel,
      closePanel,
      togglePanel
    }}>
      {children}
    </PanelContext.Provider>
  );
}

// Hook for using the panel context
export function usePanel() {
  const context = useContext(PanelContext);
  if (context === undefined) {
    throw new Error('usePanel must be used within a PanelProvider');
  }
  return context;
}

// Specialized hooks for specific panels (for backward compatibility)
export function useNotesPanel() {
  const panel = usePanel();
  
  return {
    isOpen: panel.isPanelOpen('notes'),
    toggle: () => panel.togglePanel('notes'),
    open: () => panel.openPanel('notes'),
    close: panel.closePanel
  };
}

export function useHabitsPanel() {
  const panel = usePanel();
  
  return {
    isOpen: panel.isPanelOpen('habits'),
    toggle: () => panel.togglePanel('habits'),
    open: () => panel.openPanel('habits'),
    close: panel.closePanel
  };
}
