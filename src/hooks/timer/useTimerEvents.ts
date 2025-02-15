
import { useCallback } from 'react';
import { eventBus } from '@/lib/eventBus';
import type { TimerEventType, TimerEventPayloads } from '@/types/events';
import type { TimerMetrics } from '@/types/metrics';
import type { Quote } from '@/types/timer/models';
import { toast } from 'sonner';

export const useTimerEvents = () => {
  const emitTimerEvent = useCallback(<T extends TimerEventType>(
    eventType: T,
    payload: TimerEventPayloads[T]
  ) => {
    console.log(`[Timer Event] Emitting ${eventType}:`, payload);
    eventBus.emit(eventType, payload);
  }, []);

  const handleTimerStart = useCallback((taskName: string, duration: number) => {
    emitTimerEvent('timer:start', { taskName, duration });
    toast.success("Timer started! Let's focus! 🎯");
  }, [emitTimerEvent]);

  const handleTimerPause = useCallback((timeLeft: number, taskName: string) => {
    emitTimerEvent('timer:pause', { timeLeft, taskName });
    toast.info('Timer paused. Take a short break! ⏸️');
  }, [emitTimerEvent]);

  const handleTimerComplete = useCallback((metrics: TimerMetrics, taskName: string) => {
    emitTimerEvent('timer:complete', { metrics, taskName });
    toast.success('Great work! Timer completed! 🎉');
  }, [emitTimerEvent]);

  const handleTimerUpdate = useCallback((timeLeft: number, isRunning: boolean) => {
    emitTimerEvent('timer:update', { timeLeft, isRunning });
  }, [emitTimerEvent]);

  const handleMetricsUpdate = useCallback((metrics: Partial<TimerMetrics>) => {
    emitTimerEvent('timer:metrics-update', { metrics });
  }, [emitTimerEvent]);

  const handleQuoteFavorite = useCallback((quote: Quote, taskName: string) => {
    emitTimerEvent('timer:quote-favorite', { quote, taskName });
    toast.success('Quote added to favorites! 📝');
  }, [emitTimerEvent]);

  return {
    emitTimerEvent,
    handleTimerStart,
    handleTimerPause,
    handleTimerComplete,
    handleTimerUpdate,
    handleMetricsUpdate,
    handleQuoteFavorite
  };
};

