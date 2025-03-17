
import { useCallback } from "react";
import { eventManager } from "@/lib/events/EventManager";

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
    // Use eventManager to emit timer:close event
    eventManager.emit('timer:close', { taskName });
    
    // Reset the timer
    reset();
  }, [reset, taskName]);

  return handleClose;
};
