
// Debug utilities
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { logger } from '@/utils/logManager';

// Debug context types
type DebugContextType = {
  isDebugMode: boolean;
  toggleDebugMode: () => void;
  logEvent: (category: string, event: string, data?: any) => void;
  events: DebugEvent[];
  clearEvents: () => void;
  getFilteredEvents: (category?: string) => DebugEvent[];
  showPanel: boolean;
  togglePanel: () => void;
};

// Debug event type
export type DebugEvent = {
  id: string;
  timestamp: number;
  category: string;
  event: string;
  data?: any;
};

// Create the debug context with default values
const DebugContext = createContext<DebugContextType>({
  isDebugMode: false,
  toggleDebugMode: () => {},
  logEvent: () => {},
  events: [],
  clearEvents: () => {},
  getFilteredEvents: () => [],
  showPanel: false,
  togglePanel: () => {},
});

// Generate a unique ID for debug events
const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Debug provider component
export const DebugProvider = ({ children }: { children: ReactNode }) => {
  const [isDebugMode, setIsDebugMode] = useState<boolean>(
    localStorage.getItem('debug_mode') === 'true'
  );
  const [events, setEvents] = useState<DebugEvent[]>([]);
  const [showPanel, setShowPanel] = useState<boolean>(false);

  // Toggle debug mode
  const toggleDebugMode = useCallback(() => {
    const newValue = !isDebugMode;
    setIsDebugMode(newValue);
    localStorage.setItem('debug_mode', newValue.toString());
  }, [isDebugMode]);

  // Log a new event
  const logEvent = useCallback(
    (category: string, event: string, data?: any) => {
      if (!isDebugMode) return;

      const newEvent: DebugEvent = {
        id: generateId(),
        timestamp: Date.now(),
        category,
        event,
        data,
      };

      setEvents((prev) => [newEvent, ...prev].slice(0, 100)); // Keep only the latest 100 events
      logger.debug(category, `${event}: ${JSON.stringify(data)}`);
    },
    [isDebugMode]
  );

  // Clear all events
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  // Get filtered events by category
  const getFilteredEvents = useCallback(
    (category?: string) => {
      if (!category) return events;
      return events.filter((e) => e.category === category);
    },
    [events]
  );

  // Toggle debug panel visibility
  const togglePanel = useCallback(() => {
    setShowPanel((prev) => !prev);
  }, []);

  // Initialize debug keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+Shift+D to toggle debug mode
      if (e.altKey && e.shiftKey && e.key === 'D') {
        toggleDebugMode();
      }
      
      // Alt+Shift+P to toggle panel visibility
      if (e.altKey && e.shiftKey && e.key === 'P') {
        togglePanel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleDebugMode, togglePanel]);

  // Log debug mode changes
  useEffect(() => {
    console.log(`Debug mode: ${isDebugMode ? 'enabled' : 'disabled'}`);
  }, [isDebugMode]);

  // Provide context value
  const contextValue = {
    isDebugMode,
    toggleDebugMode,
    logEvent,
    events,
    clearEvents,
    getFilteredEvents,
    showPanel,
    togglePanel,
  };

  return (
    <DebugContext.Provider value={contextValue}>
      {children}
    </DebugContext.Provider>
  );
};

// Custom hook for using debug context
export const useDebug = () => {
  const context = useContext(DebugContext);
  
  if (!context) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  
  return context;
};

// Logging functions
export function logRender(componentName: string, props?: any) {
  console.log(`[RENDER] ${componentName}`, props || '');
}

export function logMount(componentName: string) {
  console.log(`[MOUNT] ${componentName}`);
}

export function logUnmount(componentName: string) {
  console.log(`[UNMOUNT] ${componentName}`);
}

export function logEffect(componentName: string, effectName: string) {
  console.log(`[EFFECT] ${componentName} - ${effectName}`);
}

export function logState(componentName: string, stateName: string, value: any) {
  console.log(`[STATE] ${componentName} - ${stateName}:`, value);
}

export function logError(componentName: string, error: Error) {
  console.error(`[ERROR] ${componentName}:`, error);
}

export function logPerformance(componentName: string, operation: string, time: number) {
  console.log(`[PERF] ${componentName} - ${operation}: ${time}ms`);
}

export const debugUtils = {
  logRender,
  logMount,
  logUnmount,
  logEffect,
  logState,
  logError,
  logPerformance,
};

export default debugUtils;
