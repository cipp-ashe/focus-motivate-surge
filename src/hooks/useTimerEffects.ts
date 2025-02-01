import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface UseTimerEffectsProps {
  timeLeft: number;
  isRunning: boolean;
  onComplete: () => void;
  taskName: string;
  resetStates: () => void;
}

export const useTimerEffects = ({
  timeLeft,
  isRunning,
  onComplete,
  taskName,
  resetStates,
}: UseTimerEffectsProps) => {
  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      console.log(`Timer completed for task: ${taskName}`);
      onComplete();
    }
  }, [timeLeft, isRunning, onComplete, taskName]);

  // Reset states when task changes
  useEffect(() => {
    console.log("Task changed, resetting states for:", taskName);
    resetStates();
  }, [taskName, resetStates]);

  const handleComplete = useCallback(() => {
    console.log("Handling timer completion for:", taskName);
    onComplete();
    toast.success("Timer completed! Great work! 🎉");
  }, [onComplete, taskName]);

  return {
    handleComplete,
  };
};