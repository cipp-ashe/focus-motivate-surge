
import React, { useEffect } from 'react';
import { useEvent } from '@/hooks/useEvent';
import { useTimerModal } from '@/hooks/timer/useTimerModal';
import { logger } from '@/utils/logManager';

export const TimerConfigModalListener: React.FC = () => {
  const { openTimerModal } = useTimerModal();

  // Listen for timer:open-config events
  useEvent('timer:open-config', (payload: any) => {
    logger.debug('TimerConfigModalListener', 'timer:open-config event received', payload);
    if (typeof openTimerModal === 'function') {
      openTimerModal();
    }
  });

  return null;
};
