
import { useEffect } from 'react';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';

interface TaskEventListenerProps {
  onShowImage: (imageUrl: string, taskName: string) => void;
  onOpenChecklist: (taskId: string, taskName: string, items: any[]) => void;
  onOpenJournal: (taskId: string, taskName: string, entry: string) => void;
  onOpenVoiceRecorder: (taskId: string, taskName: string) => void;
  onTaskUpdate: (taskId: string, updates: any) => void;
}

export const TaskEventListener: React.FC<TaskEventListenerProps> = ({
  onShowImage,
  onOpenChecklist,
  onOpenJournal,
  onOpenVoiceRecorder,
  onTaskUpdate
}) => {
  useEffect(() => {
    console.log('TaskEventListener: Setting up event listeners');
    
    // Handler for opening screenshot/image viewer
    const handleOpenImage = (data: { taskId: string; imageUrl: string; taskName: string }) => {
      console.log('TaskEventListener: Received show-image event:', data);
      onShowImage(data.imageUrl, data.taskName);
    };
    
    // Handler for opening checklist
    const handleOpenChecklist = (data: { taskId: string; taskName: string; items: any[] }) => {
      console.log('TaskEventListener: Received open-checklist event:', data);
      onOpenChecklist(data.taskId, data.taskName, data.items || []);
    };
    
    // Handler for opening journal
    const handleOpenJournal = (data: { taskId: string; taskName: string; entry: string }) => {
      console.log('TaskEventListener: Received open-journal event:', data);
      onOpenJournal(data.taskId, data.taskName, data.entry || '');
    };
    
    // Handler for opening voice recorder
    const handleOpenVoiceRecorder = (data: { taskId: string; taskName: string }) => {
      console.log('TaskEventListener: Received open-voice-recorder event:', data);
      onOpenVoiceRecorder(data.taskId, data.taskName);
    };
    
    // Handler for task updates - making it a one-way process to avoid loops
    const handleTaskUpdate = (data: { taskId: string; updates: any }) => {
      console.log('TaskEventListener: Task update event received', data);
      // Only forward task updates that don't originate from dialogs
      if (!data.updates.journalEntry && !data.updates.checklistItems) {
        onTaskUpdate(data.taskId, data.updates);
      }
    };
    
    // Handler for timer task selection
    const handleTimerTaskSet = (task: Task) => {
      console.log('TaskEventListener: Timer task set event received for', task.id);
      // We don't need to do anything special here, as this is handled by the Timer page
    };
    
    // Set up event listeners
    const unsubscribers = [
      eventBus.on('show-image', handleOpenImage),
      eventBus.on('open-checklist', handleOpenChecklist),
      eventBus.on('open-journal', handleOpenJournal),
      eventBus.on('open-voice-recorder', handleOpenVoiceRecorder),
      eventBus.on('task:update', handleTaskUpdate),
      eventBus.on('timer:set-task', handleTimerTaskSet),
    ];
    
    // Force a refresh at startup to ensure all is in sync
    window.dispatchEvent(new Event('force-task-update'));
    
    // Cleanup event listeners on unmount
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      console.log('TaskEventListener: Cleaned up event listeners');
    };
  }, [onShowImage, onOpenChecklist, onOpenJournal, onOpenVoiceRecorder, onTaskUpdate]);
  
  return null;
};
