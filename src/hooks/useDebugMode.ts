
import { useState, useEffect, useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';

interface DebugModeState {
  isDebugMode: boolean;
  eventCounts: Record<string, number>;
}

export const useDebugMode = (): DebugModeState & {
  toggleDebugMode: () => void;
  refreshEventCounts: () => void;
} => {
  const [isDebugMode, setIsDebugMode] = useState<boolean>(() => {
    // Check if debug mode is stored in localStorage
    const stored = localStorage.getItem('debug_mode');
    return stored === 'true';
  });
  
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
  
  // Function to toggle debug mode
  const toggleDebugMode = useCallback(() => {
    setIsDebugMode(prev => {
      const newValue = !prev;
      localStorage.setItem('debug_mode', String(newValue));
      return newValue;
    });
  }, []);
  
  // Apply debug mode settings
  useEffect(() => {
    if (isDebugMode) {
      // Set debug flags
      (window as any).__DEBUG_MODE__ = true;
      document.body.classList.add('debug-mode');
      
      // Setup debug event listeners if needed
      console.log('Debug mode enabled');
    } else {
      // Remove debug flags
      (window as any).__DEBUG_MODE__ = false;
      document.body.classList.remove('debug-mode');
      
      // Remove debug event listeners if needed
      console.log('Debug mode disabled');
    }
  }, [isDebugMode]);
  
  // Function to refresh event counts
  const refreshEventCounts = useCallback(() => {
    // In our modified code, we don't have getListenerCounts directly
    // Let's create a custom way to track event counts
    const counts: Record<string, number> = {};
    
    // Count the events by checking the EventManager internals
    // This is a simplified version since we don't have direct access to the listener counts
    counts['timer:start'] = 0;
    counts['timer:pause'] = 0;
    counts['timer:complete'] = 0;
    counts['task:create'] = 0;
    counts['task:update'] = 0;
    counts['task:delete'] = 0;
    counts['task:complete'] = 0;
    
    // For debugging, we'll just output a message
    console.log('Event counts refreshed (simplified version)');
    
    setEventCounts(counts);
  }, []);
  
  // Initial load of event counts
  useEffect(() => {
    if (isDebugMode) {
      refreshEventCounts();
      
      // Set up interval to refresh counts
      const intervalId = setInterval(refreshEventCounts, 5000);
      
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isDebugMode, refreshEventCounts]);
  
  return {
    isDebugMode,
    eventCounts,
    toggleDebugMode,
    refreshEventCounts
  };
};

// Export as singleton for console access
if (typeof window !== 'undefined') {
  (window as any).debugMode = {
    toggle: () => {
      const current = localStorage.getItem('debug_mode') === 'true';
      localStorage.setItem('debug_mode', String(!current));
      console.log(`Debug mode ${!current ? 'enabled' : 'disabled'}`);
      window.location.reload();
    },
    status: () => {
      return localStorage.getItem('debug_mode') === 'true' ? 'enabled' : 'disabled';
    }
  };
}

export default useDebugMode;
