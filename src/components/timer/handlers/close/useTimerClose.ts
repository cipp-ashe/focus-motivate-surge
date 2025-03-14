
import { useCallback } from "react";

interface UseTimerCloseProps {
  reset: () => Promise<void>;
  taskName: string;
}

export const useTimerClose = ({
  reset,
  taskName,
}: UseTimerCloseProps) => {
  // Handle timer close
  const handleClose = useCallback(() => {
    // Use a custom event since this event isn't in the eventBus types
    const event = new CustomEvent('timer:close', { detail: { taskName } });
    window.dispatchEvent(event);
    
    // Reset the timer
    reset();
  }, [reset, taskName]);

  return handleClose;
};
