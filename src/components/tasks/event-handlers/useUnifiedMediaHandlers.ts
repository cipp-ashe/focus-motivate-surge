
import { useCallback, MutableRefObject } from 'react';
import { useEvent } from '@/hooks/useEvent';
import { logger } from '@/utils/logManager';

interface UnifiedMediaHandlersProps {
  onShowImage?: (imageUrl: string, taskName: string) => void;
  onOpenChecklist?: (taskId: string, taskName: string, items: any[]) => void;
  onOpenJournal?: (taskId: string, taskName: string, entry: string) => void;
  onOpenVoiceRecorder?: (taskId: string, taskName: string) => void;
  isModalOpenRef: MutableRefObject<boolean>;
}

/**
 * Unified hook for media event handlers
 * 
 * This hook consolidates event handlers for media-related task actions
 */
export const useUnifiedMediaHandlers = ({
  onShowImage,
  onOpenChecklist,
  onOpenJournal,
  onOpenVoiceRecorder,
  isModalOpenRef
}: UnifiedMediaHandlersProps) => {
  // Handler for opening screenshot/image viewer
  const handleOpenImage = useCallback((data: { imageUrl: string; taskName: string }) => {
    logger.debug('MediaHandlers', 'Received show-image event:', data);
    
    // Skip if handler not provided
    if (!onShowImage) return;
    
    // Set the modal flag
    isModalOpenRef.current = true;
    
    // Call the handler
    onShowImage(data.imageUrl, data.taskName);
    
    // Reset the flag after a delay
    setTimeout(() => {
      isModalOpenRef.current = false;
    }, 500);
  }, [onShowImage, isModalOpenRef]);
  
  // Handler for opening checklist
  const handleOpenChecklist = useCallback((data: { taskId: string; taskName: string; items: any[] }) => {
    logger.debug('MediaHandlers', 'Received open-checklist event:', data);
    
    if (!onOpenChecklist) return;
    
    isModalOpenRef.current = true;
    onOpenChecklist(data.taskId, data.taskName, data.items || []);
    setTimeout(() => { isModalOpenRef.current = false; }, 500);
  }, [onOpenChecklist, isModalOpenRef]);
  
  // Handler for opening journal
  const handleOpenJournal = useCallback((data: { taskId: string; taskName: string; entry: string }) => {
    logger.debug('MediaHandlers', 'Received open-journal event:', data);
    
    if (!onOpenJournal) return;
    
    isModalOpenRef.current = true;
    onOpenJournal(data.taskId, data.taskName, data.entry || '');
    setTimeout(() => { isModalOpenRef.current = false; }, 500);
  }, [onOpenJournal, isModalOpenRef]);
  
  // Handler for opening voice recorder
  const handleOpenVoiceRecorder = useCallback((data: { taskId: string; taskName: string }) => {
    logger.debug('MediaHandlers', 'Received open-voice-recorder event:', data);
    
    if (!onOpenVoiceRecorder) return;
    
    isModalOpenRef.current = true;
    onOpenVoiceRecorder(data.taskId, data.taskName);
    setTimeout(() => { isModalOpenRef.current = false; }, 500);
  }, [onOpenVoiceRecorder, isModalOpenRef]);

  // Set up event listeners using useEvent
  useEvent('task:show-image', handleOpenImage);
  useEvent('task:open-checklist', handleOpenChecklist);
  useEvent('task:open-journal', handleOpenJournal);
  useEvent('task:open-voice-recorder', handleOpenVoiceRecorder);

  return {
    handleOpenImage,
    handleOpenChecklist,
    handleOpenJournal,
    handleOpenVoiceRecorder
  };
};
