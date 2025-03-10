
import { useState, useCallback } from 'react';

/**
 * Hook for managing event debouncing to prevent too frequent updates
 */
export const useEventDebounce = () => {
  const [lastEventTime, setLastEventTime] = useState<Record<string, number>>({});
  const [lastForceUpdateTime, setLastForceUpdateTime] = useState(0);
  
  // Helper function to debounce events
  const shouldProcessEvent = useCallback((eventType: string, minDelay: number = 300): boolean => {
    const now = Date.now();
    const lastTime = lastEventTime[eventType] || 0;
    
    if (now - lastTime < minDelay) {
      console.log(`TaskEvents: Skipping ${eventType}, too frequent (${now - lastTime}ms)`);
      return false;
    }
    
    setLastEventTime(prev => ({ ...prev, [eventType]: now }));
    return true;
  }, [lastEventTime]);
  
  return {
    lastEventTime,
    setLastEventTime,
    lastForceUpdateTime,
    setLastForceUpdateTime,
    shouldProcessEvent,
  };
};
