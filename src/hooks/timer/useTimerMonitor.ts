
import { useEffect, useRef } from 'react';
import { eventManager } from '@/lib/events/EventManager';

interface UseTimerMonitorProps {
  onComplete?: () => void;
  onProgress?: (secondsLeft: number) => void;
  onStart?: (taskName: string, duration: number) => void;
  onPause?: () => void;
  onResume?: () => void;
  onTick?: (secondsLeft: number) => void;
}

export const useTimerMonitor = ({
  onComplete,
  onProgress,
  onStart,
  onPause,
  onResume,
  onTick,
}: UseTimerMonitorProps = {}) => {
  const timerInfoRef = useRef({
    isActive: false,
    secondsLeft: 0,
    taskName: '',
    totalSeconds: 0,
  });
  
  // Throttling refs to prevent excessive updates
  const lastTickTimeRef = useRef<number>(0);

  useEffect(() => {
    console.log("Setting up timer monitor event listeners");
    
    // Update the handler to correctly process remaining or timeLeft values with throttling
    const handleTimerTick = (payload: { timeLeft?: number; remaining?: number; taskName?: string }) => {
      // Use either timeLeft or remaining based on what's available
      const timeLeft = payload.timeLeft !== undefined ? payload.timeLeft : payload.remaining;
      
      if (timeLeft !== undefined) {
        // Apply throttling to reduce excessive updates
        const now = Date.now();
        if (now - lastTickTimeRef.current > 500 || Math.abs(timerInfoRef.current.secondsLeft - timeLeft) > 5) {
          lastTickTimeRef.current = now;
          timerInfoRef.current.secondsLeft = timeLeft;
          timerInfoRef.current.isActive = true; // Assume running when tick received
          
          // Call both callbacks if provided
          if (onProgress) onProgress(timeLeft);
          if (onTick) onTick(timeLeft);
          
          // Log only occasionally to avoid console flood
          if (now % 5000 < 1000) {
            console.log(`Timer tick: ${timeLeft}s remaining for ${payload.taskName}`);
          }
        }
      }
    };

    const handleTimerStart = ({
      taskName,
      duration,
    }: {
      taskName: string;
      duration: number;
      currentTime?: number;
    }) => {
      console.log(`Timer start event received for ${taskName} with duration ${duration}`);
      timerInfoRef.current = {
        isActive: true,
        secondsLeft: duration,
        taskName,
        totalSeconds: duration,
      };
      
      if (onStart) onStart(taskName, duration);
    };

    const handleTimerPause = ({ timeLeft }: { taskName: string; timeLeft: number }) => {
      console.log("Timer pause event received");
      timerInfoRef.current.isActive = false;
      
      // Update seconds left if provided
      if (timeLeft !== undefined) {
        timerInfoRef.current.secondsLeft = timeLeft;
      }
      
      if (onPause) onPause();
    };

    const handleTimerResume = ({ timeLeft }: { taskName: string; timeLeft: number }) => {
      console.log("Timer resume event received");
      timerInfoRef.current.isActive = true;
      
      // Update seconds left if provided
      if (timeLeft !== undefined) {
        timerInfoRef.current.secondsLeft = timeLeft;
      }
      
      if (onResume) onResume();
    };

    const handleTimerComplete = () => {
      console.log("Timer complete event received");
      timerInfoRef.current.isActive = false;
      timerInfoRef.current.secondsLeft = 0;
      if (onComplete) onComplete();
    };

    // Handle timer reset event
    const handleTimerReset = ({ taskName, duration }: { taskName: string; duration?: number }) => {
      console.log(`Timer reset event received for ${taskName} with duration ${duration}`);
      timerInfoRef.current = {
        isActive: false,
        secondsLeft: duration || timerInfoRef.current.totalSeconds,
        taskName,
        totalSeconds: duration || timerInfoRef.current.totalSeconds,
      };
    };

    // Subscribe to timer events
    const unsubscribeTick = eventManager.on('timer:tick', handleTimerTick);
    const unsubscribeStart = eventManager.on('timer:start', handleTimerStart);
    const unsubscribePause = eventManager.on('timer:pause', handleTimerPause);
    const unsubscribeResume = eventManager.on('timer:resume', handleTimerResume);
    const unsubscribeComplete = eventManager.on('timer:complete', handleTimerComplete);
    const unsubscribeReset = eventManager.on('timer:reset', handleTimerReset);

    console.log("Timer monitor event listeners set up");

    return () => {
      console.log("Cleaning up timer monitor event listeners");
      unsubscribeTick();
      unsubscribeStart();
      unsubscribePause();
      unsubscribeResume();
      unsubscribeComplete();
      unsubscribeReset();
    };
  }, [onComplete, onProgress, onStart, onPause, onResume, onTick]);

  return {
    get isActive() {
      return timerInfoRef.current.isActive;
    },
    get secondsLeft() {
      return timerInfoRef.current.secondsLeft;
    },
    get taskName() {
      return timerInfoRef.current.taskName;
    },
    get totalSeconds() {
      return timerInfoRef.current.totalSeconds;
    },
    get percentCompleted() {
      const { totalSeconds, secondsLeft } = timerInfoRef.current;
      if (totalSeconds === 0) return 0;
      return Math.floor(((totalSeconds - secondsLeft) / totalSeconds) * 100);
    },
  };
};
