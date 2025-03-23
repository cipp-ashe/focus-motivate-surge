
import { useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { useTimerEvents } from '@/hooks/timer/useTimerEvents';

export const useTimerEventListeners = () => {
  const timerEvents = useTimerEvents();

  useEffect(() => {
    const handleTaskComplete = (data: any) => {
      const { taskId, taskName, metrics } = data;
      console.log('Timer: Task completed', { taskId, taskName, metrics });
    };

    const handleTimerStart = (data: any) => {
      const { taskId, taskName, duration } = data;
      console.log('Timer: Timer started', { taskId, taskName, duration });
    };

    const unsubComplete = eventManager.on('timer:complete', handleTaskComplete);
    const unsubStart = eventManager.on('timer:start', handleTimerStart);

    return () => {
      unsubComplete();
      unsubStart();
    };
  }, []);

  return timerEvents;
};
