
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { IS_DEV } from '@/utils/debug/types';

type DebugLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

interface DebugContextType {
  isEnabled: boolean;
  debugLevel: DebugLevel;
  componentRenderCounts: Record<string, number>;
  stateChanges: Array<{
    component: string;
    stateName: string;
    prevValue: any;
    newValue: any;
    timestamp: number;
  }>;
  contextChanges: Array<{
    providerName: string;
    timestamp: number;
    changes: Record<string, any>;
  }>;
  renderTimings: Record<string, number[]>;
  toggleDebugging: () => void;
  setDebugLevel: (level: DebugLevel) => void;
  trackRender: (componentName: string) => void;
  trackStateChange: (component: string, stateName: string, prevValue: any, newValue: any) => void;
  trackContextChange: (providerName: string, changes: Record<string, any>) => void;
  trackRenderTiming: (componentName: string, duration: number) => void;
  clearLogs: () => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export function DebugProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(() => {
    // Check localStorage or default to true in development, false in production
    return localStorage.getItem('debug_enabled') === 'true' || IS_DEV;
  });
  
  const [debugLevel, setDebugLevel] = useState<DebugLevel>('info');
  const [componentRenderCounts, setComponentRenderCounts] = useState<Record<string, number>>({});
  const [stateChanges, setStateChanges] = useState<DebugContextType['stateChanges']>([]);
  const [contextChanges, setContextChanges] = useState<DebugContextType['contextChanges']>([]);
  const [renderTimings, setRenderTimings] = useState<Record<string, number[]>>({});

  // Log to console when debug mode changes
  useEffect(() => {
    console.log(`🔍 Debug mode: ${isEnabled ? 'enabled' : 'disabled'}`);
    
    // Persist debug state to localStorage
    localStorage.setItem('debug_enabled', String(isEnabled));
    
    // Add debug class to body for potential CSS targeting
    if (isEnabled) {
      document.body.classList.add('debug-mode');
    } else {
      document.body.classList.remove('debug-mode');
    }
  }, [isEnabled]);

  // Toggle debug mode
  const toggleDebugging = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  // Track component render
  const trackRender = useCallback((componentName: string) => {
    if (!isEnabled) return;
    
    setComponentRenderCounts(prev => {
      const count = (prev[componentName] || 0) + 1;
      console.log(`🔄 ${componentName} rendered: ${count} time${count > 1 ? 's' : ''}`);
      return { ...prev, [componentName]: count };
    });
  }, [isEnabled]);

  // Track state change
  const trackStateChange = useCallback((
    component: string,
    stateName: string,
    prevValue: any,
    newValue: any
  ) => {
    if (!isEnabled) return;
    
    const change = {
      component,
      stateName,
      prevValue,
      newValue,
      timestamp: Date.now()
    };
    
    console.log(`📊 ${component} state change:`, {
      state: stateName,
      from: prevValue,
      to: newValue,
      diff: typeof newValue === 'object' && typeof prevValue === 'object' ? 
        getDiff(prevValue, newValue) : 'n/a'
    });
    
    setStateChanges(prev => [...prev.slice(-99), change]);
  }, [isEnabled]);

  // Track context change
  const trackContextChange = useCallback((
    providerName: string,
    changes: Record<string, any>
  ) => {
    if (!isEnabled) return;
    
    const change = {
      providerName,
      timestamp: Date.now(),
      changes
    };
    
    console.log(`🌍 ${providerName} context changed:`, changes);
    
    setContextChanges(prev => [...prev.slice(-49), change]);
  }, [isEnabled]);

  // Track render timing
  const trackRenderTiming = useCallback((
    componentName: string,
    duration: number
  ) => {
    if (!isEnabled) return;
    
    setRenderTimings(prev => {
      const timings = [...(prev[componentName] || []), duration].slice(-10);
      const avg = timings.reduce((sum, t) => sum + t, 0) / timings.length;
      
      if (duration > 16) { // 16ms = ~60fps threshold
        console.warn(`⏱️ Slow render in ${componentName}: ${duration.toFixed(2)}ms (avg: ${avg.toFixed(2)}ms)`);
      }
      
      return { ...prev, [componentName]: timings };
    });
  }, [isEnabled]);

  // Clear all logs
  const clearLogs = useCallback(() => {
    setComponentRenderCounts({});
    setStateChanges([]);
    setContextChanges([]);
    setRenderTimings({});
    console.clear();
    console.log('Debug logs cleared');
  }, []);

  const value = {
    isEnabled,
    debugLevel,
    componentRenderCounts,
    stateChanges,
    contextChanges,
    renderTimings,
    toggleDebugging,
    setDebugLevel,
    trackRender,
    trackStateChange,
    trackContextChange,
    trackRenderTiming,
    clearLogs
  };

  return (
    <DebugContext.Provider value={value}>
      {children}
    </DebugContext.Provider>
  );
}

export function useDebugContext() {
  const context = useContext(DebugContext);
  
  if (context === undefined) {
    throw new Error('useDebugContext must be used within a DebugProvider');
  }
  
  return context;
}

// Helper function to get differences between objects
function getDiff(a: Record<string, any>, b: Record<string, any>) {
  const diff: Record<string, { old: any, new: any }> = {};
  
  // Check for changed or added properties
  Object.keys(b).forEach(key => {
    if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) {
      diff[key] = { old: a[key], new: b[key] };
    }
  });
  
  // Check for removed properties
  Object.keys(a).forEach(key => {
    if (!(key in b)) {
      diff[key] = { old: a[key], new: undefined };
    }
  });
  
  return diff;
}
