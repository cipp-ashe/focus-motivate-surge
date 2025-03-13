
import React, { useEffect } from 'react';
import { ChecklistItem, Task } from '@/types/tasks';

interface TaskEventListenerProps {
  onShowImage: (imageUrl: string, taskName: string) => void;
  onOpenChecklist: (taskId: string, taskName: string, items: ChecklistItem[]) => void;
  onOpenJournal: (taskId: string, taskName: string, entry: string) => void;
  onOpenVoiceRecorder: (taskId: string, taskName: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export const TaskEventListener: React.FC<TaskEventListenerProps> = ({
  onShowImage,
  onOpenChecklist,
  onOpenJournal,
  onOpenVoiceRecorder,
  onTaskUpdate
}) => {
  useEffect(() => {
    console.log('TaskEventListener - Setting up event listeners');
    
    const handleShowImage = (event: CustomEvent) => {
      const { imageUrl, taskName } = event.detail;
      console.log('TaskEventListener - Received show-image event');
      onShowImage(imageUrl, taskName);
    };
    
    const handleOpenChecklist = (event: CustomEvent) => {
      const { taskId, taskName, items } = event.detail;
      console.log('TaskEventListener - Received open-checklist event');
      onOpenChecklist(taskId, taskName, items);
    };
    
    const handleOpenJournal = (event: CustomEvent) => {
      const { taskId, taskName, entry } = event.detail;
      console.log('TaskEventListener - Received open-journal event');
      onOpenJournal(taskId, taskName, entry);
    };
    
    const handleOpenVoiceRecorder = (event: CustomEvent) => {
      const { taskId, taskName } = event.detail;
      console.log('TaskEventListener - Received open-voice-recorder event');
      onOpenVoiceRecorder(taskId, taskName);
    };
    
    const handleTaskUpdate = (event: CustomEvent) => {
      const { taskId, updates } = event.detail;
      console.log('TaskEventListener - Received task-update event');
      onTaskUpdate(taskId, updates);
    };
    
    window.addEventListener('show-image', handleShowImage as EventListener);
    window.addEventListener('open-checklist', handleOpenChecklist as EventListener);
    window.addEventListener('open-journal', handleOpenJournal as EventListener);
    window.addEventListener('open-voice-recorder', handleOpenVoiceRecorder as EventListener);
    window.addEventListener('task-update', handleTaskUpdate as EventListener);
    
    return () => {
      window.removeEventListener('show-image', handleShowImage as EventListener);
      window.removeEventListener('open-checklist', handleOpenChecklist as EventListener);
      window.removeEventListener('open-journal', handleOpenJournal as EventListener);
      window.removeEventListener('open-voice-recorder', handleOpenVoiceRecorder as EventListener);
      window.removeEventListener('task-update', handleTaskUpdate as EventListener);
    };
  }, [onShowImage, onOpenChecklist, onOpenJournal, onOpenVoiceRecorder, onTaskUpdate]);
  
  return null;
};
