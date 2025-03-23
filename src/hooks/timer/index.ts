import { useCallback, useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useSounds } from '@/hooks/ui/useSounds';
import { useTaskActions } from '@/hooks/tasks/useTaskActions';
import { useTimerEvents } from './useTimerEvents';

// Timer hook that provides timer functionality with sounds
export const useTimer = (initialDuration = 1500, autoStart = false) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const { playSound } = useSounds();
	const { completeTask } = useTaskActions();
  const timerEvents = useTimerEvents();

  // Function to start the timer
  const startTimer = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    setIsPaused(false);
    timerId.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId.current!);
          setIsRunning(false);
          setIsCompleted(true);
          playSound('timerEnd');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }, [isRunning, playSound]);

  // Function to pause the timer
  const pauseTimer = useCallback(() => {
    if (!isRunning) return;

    clearInterval(timerId.current!);
    setIsRunning(false);
    setIsPaused(true);
  }, [isRunning]);

  // Function to resume the timer
  const resumeTimer = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    setIsPaused(false);
    timerId.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId.current!);
          setIsRunning(false);
          setIsCompleted(true);
          playSound('timerEnd');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }, [isRunning, playSound]);

  // Function to reset the timer
  const resetTimer = useCallback((newDuration: number = initialDuration) => {
    clearInterval(timerId.current!);
    setIsRunning(false);
    setIsCompleted(false);
    setIsPaused(false);
    setTimeLeft(newDuration);
  }, [initialDuration]);

  // Function to complete the timer
  const completeTimer = useCallback((taskId: string, metrics: any) => {
    clearInterval(timerId.current!);
    setIsRunning(false);
    setIsCompleted(true);
    setIsPaused(false);
    setTimeLeft(0);
		completeTask(taskId, metrics);
    toast.success('Timer completed!');
  }, [completeTask]);

  // Automatically start the timer if autoStart is true
  useEffect(() => {
    if (autoStart) {
      startTimer();
    }

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      if (timerId.current) {
        clearInterval(timerId.current);
      }
    };
  }, [autoStart, startTimer]);

  return {
    isRunning,
    timeLeft,
    isCompleted,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    completeTimer,
  };
};

// Export other timer-related hooks
export { useTimerEvents };
