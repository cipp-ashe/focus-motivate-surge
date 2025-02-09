
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

  useEffect(() => {
    if (validate && !validate(value)) {
      const message = `Invalid ${name} state in ${component}`;
      console.warn(message, { value });
      
      if (onInvalid) {
        onInvalid(value);
      } else {
        toast.warning(message, {
          description: "Check console for details"
        });
      }
    }

    // Log significant state changes
    if (JSON.stringify(prevValue.current) !== JSON.stringify(value)) {
      console.log(`[${component}] ${name} changed:`, {
        from: prevValue.current,
        to: value
      });
    }

    prevValue.current = value;
  }, [value, name, validate, onInvalid, component]);
};
