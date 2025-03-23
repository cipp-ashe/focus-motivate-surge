
/**
 * Debug context provider for React applications
 */
import React, { createContext, useContext, useState } from 'react';
import { DebugLevel, DebugModule, IS_DEV } from './types';

interface DebugContextType {
  isEnabled: boolean;
  toggleDebug: () => void;
  debugLevel: DebugLevel;
  setDebugLevel: (level: DebugLevel) => void;
  enabledModules: Set<DebugModule>;
  toggleModule: (module: DebugModule) => void;
  lastError: Error | null;
  setLastError: (error: Error | null) => void;
  logs: any[];
  clearLogs: () => void;
}

const DebugContext = createContext<DebugContextType>({
  isEnabled: IS_DEV,
  toggleDebug: () => {},
  debugLevel: 'info',
  setDebugLevel: () => {},
  enabledModules: new Set<DebugModule>(['app']),
  toggleModule: () => {},
  lastError: null,
  setLastError: () => {},
  logs: [],
  clearLogs: () => {}
});

export const useDebugContext = () => useContext(DebugContext);

interface DebugProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function DebugProvider({ children, enabled = IS_DEV }: DebugProviderProps) {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [debugLevel, setDebugLevel] = useState<DebugLevel>('info');
  const [enabledModules, setEnabledModules] = useState<Set<DebugModule>>(new Set(['app']));
  const [lastError, setLastError] = useState<Error | null>(null);
  const [logs, setLogs] = useState<any[]>([]);

  const toggleDebug = () => setIsEnabled(prev => !prev);

  const toggleModule = (module: DebugModule) => {
    setEnabledModules(prev => {
      const newModules = new Set(prev);
      if (newModules.has(module)) {
        newModules.delete(module);
      } else {
        newModules.add(module);
      }
      return newModules;
    });
  };

  const clearLogs = () => setLogs([]);

  const value = {
    isEnabled,
    toggleDebug,
    debugLevel,
    setDebugLevel,
    enabledModules,
    toggleModule,
    lastError,
    setLastError,
    logs,
    clearLogs
  };

  return (
    <DebugContext.Provider value={value}>
      {children}
    </DebugContext.Provider>
  );
}
