
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

  useEffect(() => {
    console.log("Setting up timer monitor event listeners");
    
    // Listen for custom timer tick events from window
    const handleWindowTimerTick = (e: CustomEvent) => {
      if (e.detail && e.detail.timeLeft !== undefined) {
        if (onTick) onTick(e.detail.timeLeft);
        if (onProgress) onProgress(e.detail.timeLeft);
        timerInfoRef.current.secondsLeft = e.detail.timeLeft;
        console.log(`Timer tick from window event: ${e.detail.timeLeft}s`);
      }
    };
    
    // Add window event listener for custom timer tick events
    window.addEventListener('timer:tick', handleWindowTimerTick as EventListener);
    
    // Update the handler to correctly process remaining or timeLeft values
    const handleTimerTick = (payload: { timeLeft?: number; remaining?: number; taskName?: string }) => {
      // Use either timeLeft or remaining based on what's available
      const timeLeft = payload.timeLeft !== undefined ? payload.timeLeft : payload.remaining;
      
      if (timeLeft !== undefined) {
        timerInfoRef.current.secondsLeft = timeLeft;
        timerInfoRef.current.isActive = true; // Assume running when tick received
        
        // Call both callbacks if provided
        if (onProgress) onProgress(timeLeft);
        if (onTick) onTick(timeLeft);
        
        console.log(`Timer tick processed: ${timeLeft}s remaining`);
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

    const handleTimerPause = () => {
      console.log("Timer pause event received");
      timerInfoRef.current.isActive = false;
      if (onPause) onPause();
    };

    const handleTimerResume = () => {
      console.log("Timer resume event received");
      timerInfoRef.current.isActive = true;
      if (onResume) onResume();
    };

    const handleTimerComplete = () => {
      console.log("Timer complete event received");
      timerInfoRef.current.isActive = false;
      timerInfoRef.current.secondsLeft = 0;
      if (onComplete) onComplete();
    };

    // Handle timer reset event
    const handleTimerReset = ({ taskName, duration }: { taskName: string; duration: number }) => {
      console.log(`Timer reset event received for ${taskName} with duration ${duration}`);
      timerInfoRef.current = {
        isActive: false,
        secondsLeft: duration,
        taskName,
        totalSeconds: duration,
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
      window.removeEventListener('timer:tick', handleWindowTimerTick as EventListener);
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
