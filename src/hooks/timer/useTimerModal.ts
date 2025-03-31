
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { logger } from '@/utils/logManager';

export const useTimerModal = () => {
  const openTimerModal = useCallback(() => {
    logger.debug('useTimerModal', 'Opening timer modal');
    eventManager.emit('modal:open', { type: 'timer-config' });
  }, []);

  const closeTimerModal = useCallback(() => {
    logger.debug('useTimerModal', 'Closing timer modal');
    eventManager.emit('modal:close', { type: 'timer-config' });
  }, []);

  return {
    openTimerModal,
    closeTimerModal
  };
};
