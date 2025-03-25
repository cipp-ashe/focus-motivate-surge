
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';

/**
 * Hook for managing timer modal functionality
 */
export const useTimerModal = () => {
  const openTimerModal = useCallback(() => {
    eventManager.emit('timer:open-modal', {
      type: 'instant'
    });
  }, []);

  const openTimerModalWithTask = useCallback((taskId: string, taskName: string, duration: number) => {
    eventManager.emit('timer:open-modal', {
      type: 'task',
      taskId,
      taskName,
      duration
    });
  }, []);

  return {
    openTimerModal,
    openTimerModalWithTask
  };
};
