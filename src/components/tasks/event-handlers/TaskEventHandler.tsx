
import { useEffect, useRef } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { Task } from '@/types/tasks';
import { useMediaHandlers } from './MediaEventHandlers';
import { useTaskUpdateHandler } from './TaskUpdateHandler';
import { useTimerTaskHandler } from './TimerTaskHandler';
import { useNavigate } from 'react-router-dom';

interface TaskEventListenerProps {
  onShowImage: (imageUrl: string, taskName: string) => void;
  onOpenChecklist: (taskId: string, taskName: string, items: any[]) => void;
  onOpenJournal: (taskId: string, taskName: string, entry: string) => void;
  onOpenVoiceRecorder: (taskId: string, taskName: string) => void;
  onTaskUpdate: (data: { taskId: string; updates: Partial<Task> }) => void;
}

export const TaskEventListener: React.FC<TaskEventListenerProps> = ({
  onShowImage,
  onOpenChecklist,
  onOpenJournal,
  onOpenVoiceRecorder,
  onTaskUpdate
}) => {
  const navigate = useNavigate();
  const isModalOpenRef = useRef(false);
  
  // Use focused custom hooks for handling different event categories
  const { processTaskUpdate } = useTaskUpdateHandler(onTaskUpdate, isModalOpenRef);
  const { handleTimerTaskSet } = useTimerTaskHandler(navigate);
  
  // Media handlers for image, checklist, journal, and voice recorder
  const mediaHandlers = useMediaHandlers({
    onShowImage,
    onOpenChecklist, 
    onOpenJournal,
    onOpenVoiceRecorder,
    isModalOpenRef
  });
  
  useEffect(() => {
    console.log('TaskEventListener: Setting up event listeners');
    
    // Set up event listeners with the event manager
    const unsubscribers = [
      eventManager.on('show-image', mediaHandlers.handleOpenImage),
      eventManager.on('open-checklist', mediaHandlers.handleOpenChecklist),
      eventManager.on('open-journal', mediaHandlers.handleOpenJournal),
      eventManager.on('open-voice-recorder', mediaHandlers.handleOpenVoiceRecorder),
      eventManager.on('task:update', processTaskUpdate),
      eventManager.on('timer:set-task', handleTimerTaskSet),
    ];
    
    // Add direct DOM event listeners
    window.addEventListener('open-journal', mediaHandlers.handleDomOpenJournal as EventListener);
    window.addEventListener('open-checklist', mediaHandlers.handleDomOpenChecklist as EventListener);
    window.addEventListener('show-image', mediaHandlers.handleDomShowImage as EventListener);
    window.addEventListener('open-voice-recorder', mediaHandlers.handleDomOpenVoiceRecorder as EventListener);
    window.addEventListener('force-ui-refresh', mediaHandlers.handleForceUiRefresh as EventListener);
    
    // Force a refresh at startup to ensure all is in sync
    window.dispatchEvent(new Event('force-task-update'));
    
    // Cleanup event listeners on unmount
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      window.removeEventListener('open-journal', mediaHandlers.handleDomOpenJournal as EventListener);
      window.removeEventListener('open-checklist', mediaHandlers.handleDomOpenChecklist as EventListener);
      window.removeEventListener('show-image', mediaHandlers.handleDomShowImage as EventListener);
      window.removeEventListener('open-voice-recorder', mediaHandlers.handleDomOpenVoiceRecorder as EventListener);
      window.removeEventListener('force-ui-refresh', mediaHandlers.handleForceUiRefresh as EventListener);
      console.log('TaskEventListener: Cleaned up event listeners');
    };
  }, [
    mediaHandlers, 
    processTaskUpdate, 
    handleTimerTaskSet, 
    navigate
  ]);
  
  return null;
};
