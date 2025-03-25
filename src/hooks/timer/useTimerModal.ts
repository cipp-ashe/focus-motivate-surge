
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { logger } from '@/utils/logManager';

/**
 * Hook for managing timer modal functionality
 */
export const useTimerModal = () => {
  const openTimerModal = useCallback(() => {
    logger.debug('useTimerModal', 'Opening timer modal (instant)');
    
    eventManager.emit('timer:open-modal', {
      type: 'instant'
    });
  }, []);

  const openTimerModalWithTask = useCallback((taskId: string, taskName: string, duration: number) => {
    logger.debug('useTimerModal', 'Opening timer modal with task', { taskId, taskName, duration });
    
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
