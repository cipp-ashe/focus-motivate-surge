
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface StateMonitorOptions<T> {
  value: T;
  name: string;
  validate?: (value: T) => boolean;
  onInvalid?: (value: T) => void;
  component: string;
}

export const useStateMonitor = <T,>({
  value,
  name,
  validate,
  onInvalid,
  component
}: StateMonitorOptions<T>) => {
  const prevValue = useRef<T>(value);
  const updateCount = useRef(0);
  const lastUpdateTime = useRef(Date.now());

  useEffect(() => {
    // Check validation if provided
    if (validate && !validate(value)) {
      const message = `Invalid ${name} state in ${component}`;
      console.warn(message, {
        value,
        previousValue: prevValue.current,
        updateCount: updateCount.current,
        timeSinceLastUpdate: Date.now() - lastUpdateTime.current
      });
      
      if (onInvalid) {
        onInvalid(value);
      } else {
        toast.warning(message, {
          description: "Check console for details"
        });
      }
    }

    // Track update frequency
    updateCount.current++;
    const timeSinceLastUpdate = Date.now() - lastUpdateTime.current;
    
    if (timeSinceLastUpdate < 100) { // If updates happen faster than 100ms
      console.warn(`[${component}] Rapid state updates detected for ${name}:`, {
        updateCount: updateCount.current,
        timeSinceLastUpdate,
        value
      });
    }

    // Log significant state changes
    if (JSON.stringify(prevValue.current) !== JSON.stringify(value)) {
      console.log(`[${component}] ${name} changed:`, {
        from: prevValue.current,
        to: value,
        updateCount: updateCount.current,
        timestamp: new Date().toISOString()
      });
    }

    prevValue.current = value;
    lastUpdateTime.current = Date.now();

    // Reset update count periodically
    const resetInterval = setInterval(() => {
      updateCount.current = 0;
    }, 5000);

    return () => {
      clearInterval(resetInterval);
    };
  }, [value, name, validate, onInvalid, component]);
};
