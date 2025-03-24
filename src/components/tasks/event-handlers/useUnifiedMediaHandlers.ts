
import { useCallback, MutableRefObject } from 'react';
import { useEvent } from '@/hooks/useEvent';

interface UnifiedMediaHandlersProps {
  onShowImage: (imageUrl: string, taskName: string) => void;
  onOpenChecklist: (taskId: string, taskName: string, items: any[]) => void;
  onOpenJournal: (taskId: string, taskName: string, entry: string) => void;
  onOpenVoiceRecorder: (taskId: string, taskName: string) => void;
  isModalOpenRef: MutableRefObject<boolean>;
}

/**
 * Unified hook for media event handlers
 * 
 * This hook consolidates custom event handlers and DOM event listeners
 * for handling media-related events (images, checklists, journals, voice recordings)
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
    console.log('MediaHandlers: Received show-image event:', data);
    
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
    console.log('MediaHandlers: Received open-checklist event:', data);
    isModalOpenRef.current = true;
    onOpenChecklist(data.taskId, data.taskName, data.items || []);
    setTimeout(() => { isModalOpenRef.current = false; }, 500);
  }, [onOpenChecklist, isModalOpenRef]);
  
  // Handler for opening journal
  const handleOpenJournal = useCallback((data: { taskId: string; taskName: string; entry: string }) => {
    console.log('MediaHandlers: Received open-journal event:', data);
    isModalOpenRef.current = true;
    onOpenJournal(data.taskId, data.taskName, data.entry || '');
    setTimeout(() => { isModalOpenRef.current = false; }, 500);
  }, [onOpenJournal, isModalOpenRef]);
  
  // Handler for opening voice recorder
  const handleOpenVoiceRecorder = useCallback((data: { taskId: string; taskName: string }) => {
    console.log('MediaHandlers: Received open-voice-recorder event:', data);
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
