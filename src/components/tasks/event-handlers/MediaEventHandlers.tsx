
import { useCallback, RefObject } from 'react';

interface MediaHandlersProps {
  onShowImage: (imageUrl: string, taskName: string) => void;
  onOpenChecklist: (taskId: string, taskName: string, items: any[]) => void;
  onOpenJournal: (taskId: string, taskName: string, entry: string) => void;
  onOpenVoiceRecorder: (taskId: string, taskName: string) => void;
  isModalOpenRef: RefObject<boolean>;
}

export const useMediaHandlers = ({
  onShowImage,
  onOpenChecklist,
  onOpenJournal,
  onOpenVoiceRecorder,
  isModalOpenRef
}: MediaHandlersProps) => {
  // Handler for opening screenshot/image viewer
  const handleOpenImage = useCallback((data: { taskId: string; imageUrl: string; taskName: string }) => {
    console.log('MediaEventHandlers: Received show-image event:', data);
    
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
    console.log('MediaEventHandlers: Received open-checklist event:', data);
    isModalOpenRef.current = true;
    onOpenChecklist(data.taskId, data.taskName, data.items || []);
    setTimeout(() => { isModalOpenRef.current = false; }, 500);
  }, [onOpenChecklist, isModalOpenRef]);
  
  // Handler for opening journal
  const handleOpenJournal = useCallback((data: { taskId: string; taskName: string; entry: string }) => {
    console.log('MediaEventHandlers: Received open-journal event:', data);
    isModalOpenRef.current = true;
    onOpenJournal(data.taskId, data.taskName, data.entry || '');
    setTimeout(() => { isModalOpenRef.current = false; }, 500);
  }, [onOpenJournal, isModalOpenRef]);
  
  // Handler for opening voice recorder
  const handleOpenVoiceRecorder = useCallback((data: { taskId: string; taskName: string }) => {
    console.log('MediaEventHandlers: Received open-voice-recorder event:', data);
    isModalOpenRef.current = true;
    onOpenVoiceRecorder(data.taskId, data.taskName);
    setTimeout(() => { isModalOpenRef.current = false; }, 500);
  }, [onOpenVoiceRecorder, isModalOpenRef]);

  // DOM event handlers with consistent structure
  const handleDomOpenJournal = useCallback((e: CustomEvent<{taskId: string, taskName: string, entry: string}>) => {
    console.log('MediaEventHandlers: Received DOM open-journal event:', e.detail);
    isModalOpenRef.current = true;
    onOpenJournal(e.detail.taskId, e.detail.taskName, e.detail.entry || '');
    setTimeout(() => { isModalOpenRef.current = false; }, 500);
  }, [onOpenJournal, isModalOpenRef]);
  
  const handleDomOpenChecklist = useCallback((e: CustomEvent<{taskId: string, taskName: string, items: any[]}>) => {
    console.log('MediaEventHandlers: Received DOM open-checklist event:', e.detail);
    isModalOpenRef.current = true;
    onOpenChecklist(e.detail.taskId, e.detail.taskName, e.detail.items || []);
    setTimeout(() => { isModalOpenRef.current = false; }, 500);
  }, [onOpenChecklist, isModalOpenRef]);
  
  const handleDomShowImage = useCallback((e: CustomEvent<{imageUrl: string, taskName: string}>) => {
    console.log('MediaEventHandlers: Received DOM show-image event:', e.detail);
    isModalOpenRef.current = true;
    onShowImage(e.detail.imageUrl, e.detail.taskName);
    setTimeout(() => { isModalOpenRef.current = false; }, 500);
  }, [onShowImage, isModalOpenRef]);
  
  const handleDomOpenVoiceRecorder = useCallback((e: CustomEvent<{taskId: string, taskName: string}>) => {
    console.log('MediaEventHandlers: Received DOM open-voice-recorder event:', e.detail);
    isModalOpenRef.current = true;
    onOpenVoiceRecorder(e.detail.taskId, e.detail.taskName);
    setTimeout(() => { isModalOpenRef.current = false; }, 500);
  }, [onOpenVoiceRecorder, isModalOpenRef]);
  
  // Handle the UI refresh event - this doesn't cause task updates
  const handleForceUiRefresh = useCallback((e: CustomEvent<{taskId: string}>) => {
    console.log('MediaEventHandlers: Received force-ui-refresh event:', e.detail);
    // This event exists just to trigger a UI refresh without triggering task updates
  }, []);

  return {
    handleOpenImage,
    handleOpenChecklist,
    handleOpenJournal,
    handleOpenVoiceRecorder,
    handleDomOpenJournal,
    handleDomOpenChecklist,
    handleDomShowImage,
    handleDomOpenVoiceRecorder,
    handleForceUiRefresh
  };
};
