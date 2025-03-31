
import { MutableRefObject, useCallback } from 'react';
import { useEvent } from '@/hooks/useEvent';
import { logger } from '@/utils/logManager';

interface UseUnifiedMediaHandlersProps {
  onShowImage?: (imageUrl: string, taskName: string) => void;
  onOpenChecklist?: (taskId: string, taskName: string, items: any[]) => void;
  onOpenJournal?: (taskId: string, taskName: string, entry: string) => void;
  onOpenVoiceRecorder?: (taskId: string, taskName: string) => void;
  isModalOpenRef: MutableRefObject<boolean>;
}

/**
 * Custom hook to handle all media-related task events
 */
export function useUnifiedMediaHandlers({
  onShowImage,
  onOpenChecklist,
  onOpenJournal,
  onOpenVoiceRecorder,
  isModalOpenRef
}: UseUnifiedMediaHandlersProps) {
  
  // Handle image display
  const handleShowImage = useCallback((data: { imageUrl: string; taskName: string }) => {
    logger.debug('useUnifiedMediaHandlers', 'Handling show image event', data);
    isModalOpenRef.current = true;
    
    if (onShowImage) {
      onShowImage(data.imageUrl, data.taskName);
    }
    
    // Reset modal state after a short delay to allow state to propagate
    setTimeout(() => {
      isModalOpenRef.current = false;
    }, 300);
  }, [onShowImage, isModalOpenRef]);
  
  // Handle checklist opening
  const handleOpenChecklist = useCallback((data: { taskId: string; taskName: string; items: any[] }) => {
    logger.debug('useUnifiedMediaHandlers', 'Handling open checklist event', data);
    isModalOpenRef.current = true;
    
    if (onOpenChecklist) {
      onOpenChecklist(data.taskId, data.taskName, data.items);
    }
    
    setTimeout(() => {
      isModalOpenRef.current = false;
    }, 300);
  }, [onOpenChecklist, isModalOpenRef]);
  
  // Handle journal opening
  const handleOpenJournal = useCallback((data: { taskId: string; taskName: string; entry: string }) => {
    logger.debug('useUnifiedMediaHandlers', 'Handling open journal event', data);
    isModalOpenRef.current = true;
    
    if (onOpenJournal) {
      onOpenJournal(data.taskId, data.taskName, data.entry);
    }
    
    setTimeout(() => {
      isModalOpenRef.current = false;
    }, 300);
  }, [onOpenJournal, isModalOpenRef]);
  
  // Handle voice recorder opening
  const handleOpenVoiceRecorder = useCallback((data: { taskId: string; taskName: string }) => {
    logger.debug('useUnifiedMediaHandlers', 'Handling open voice recorder event', data);
    isModalOpenRef.current = true;
    
    if (onOpenVoiceRecorder) {
      onOpenVoiceRecorder(data.taskId, data.taskName);
    }
    
    setTimeout(() => {
      isModalOpenRef.current = false;
    }, 300);
  }, [onOpenVoiceRecorder, isModalOpenRef]);
  
  // Register all event handlers
  useEvent('task:show-image', handleShowImage);
  useEvent('task:open-checklist', handleOpenChecklist);
  useEvent('task:open-journal', handleOpenJournal);
  useEvent('task:open-voice-recorder', handleOpenVoiceRecorder);
  
  return {
    handleShowImage,
    handleOpenChecklist,
    handleOpenJournal,
    handleOpenVoiceRecorder
  };
}
