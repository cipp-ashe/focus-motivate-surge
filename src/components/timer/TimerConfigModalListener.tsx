
import React, { useState, useEffect, useCallback } from 'react';
import { TimerConfigModal } from '../timer/TimerConfigModal';
import { useEvent } from '@/hooks/useEvent';
import { logger } from '@/utils/logManager';

export const TimerConfigModalListener = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<{ type: 'instant' | 'task', taskId?: string, taskName?: string, duration?: number }>({
    type: 'instant'
  });

  const handleOpenModal = useCallback((data: any) => {
    logger.debug('TimerConfigModalListener', 'Opening timer modal with data:', data);
    
    if (data) {
      setModalData({
        type: data.type || 'instant',
        taskId: data.taskId,
        taskName: data.taskName,
        duration: data.duration || 25 * 60
      });
      setIsOpen(true);
    }
  }, []);

  // Listen for timer:open-modal events
  useEvent('timer:open-modal', handleOpenModal);

  return (
    <TimerConfigModal 
      open={isOpen} 
      onOpenChange={setIsOpen}
      initialTaskName={modalData.taskName}
      initialMinutes={modalData.duration ? Math.floor(modalData.duration / 60) : 25}
    />
  );
};
