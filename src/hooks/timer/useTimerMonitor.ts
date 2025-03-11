
import { useEffect, useRef } from 'react';
import { eventBus } from '@/lib/eventBus';

interface UseTimerMonitorProps {
  onComplete?: () => void;
  onProgress?: (secondsLeft: number) => void;
  onStart?: (taskName: string, duration: number) => void;
  onPause?: () => void;
  onResume?: () => void;
}

export const useTimerMonitor = ({
  onComplete,
  onProgress,
  onStart,
  onPause,
  onResume,
}: UseTimerMonitorProps = {}) => {
  const timerInfoRef = useRef({
    isActive: false,
    secondsLeft: 0,
    taskName: '',
    totalSeconds: 0,
  });

  useEffect(() => {
    // Update the handler to accept both timeLeft and remaining properties
    const handleTimerTick = (payload: { timeLeft?: number; remaining?: number; taskName?: string }) => {
      // Use either timeLeft or remaining based on what's available
      const timeLeft = payload.timeLeft !== undefined ? payload.timeLeft : payload.remaining;
      if (timeLeft !== undefined) {
        timerInfoRef.current.secondsLeft = timeLeft;
        onProgress?.(timeLeft);
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
      timerInfoRef.current = {
        isActive: true,
        secondsLeft: duration,
        taskName,
        totalSeconds: duration,
      };
      onStart?.(taskName, duration);
    };

    const handleTimerPause = () => {
      timerInfoRef.current.isActive = false;
      onPause?.();
    };

    const handleTimerResume = () => {
      timerInfoRef.current.isActive = true;
      onResume?.();
    };

    const handleTimerComplete = () => {
      timerInfoRef.current.isActive = false;
      timerInfoRef.current.secondsLeft = 0;
      onComplete?.();
    };

    // Subscribe to timer events
    const unsubscribeTick = eventBus.on('timer:tick', handleTimerTick);
    const unsubscribeStart = eventBus.on('timer:start', handleTimerStart);
    const unsubscribePause = eventBus.on('timer:pause', handleTimerPause);
    const unsubscribeResume = eventBus.on('timer:resume', handleTimerResume);
    const unsubscribeComplete = eventBus.on('timer:complete', handleTimerComplete);

    return () => {
      unsubscribeTick();
      unsubscribeStart();
      unsubscribePause();
      unsubscribeResume();
      unsubscribeComplete();
    };
  }, [onComplete, onProgress, onStart, onPause, onResume]);

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
