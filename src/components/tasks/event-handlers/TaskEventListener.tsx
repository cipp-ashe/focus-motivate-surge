
import React, { useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { ChecklistItem, Task } from '@/types/tasks';

interface TaskEventListenerProps {
  onShowImage: (imageUrl: string, taskName: string) => void;
  onOpenChecklist: (taskId: string, taskName: string, items: ChecklistItem[]) => void;
  onOpenJournal: (taskId: string, taskName: string, entry: string) => void;
  onOpenVoiceRecorder: (taskId: string, taskName: string) => void;
  onTaskUpdate: (data: { taskId: string, updates: Partial<Task> }) => void;
}

export const TaskEventListener: React.FC<TaskEventListenerProps> = ({
  onShowImage,
  onOpenChecklist,
  onOpenJournal,
  onOpenVoiceRecorder,
  onTaskUpdate
}) => {
  useEffect(() => {
    // Set up event listeners for task-specific dialogs
    const handleShowImage = (data: { imageUrl: string, taskName: string }) => {
      onShowImage(data.imageUrl, data.taskName);
    };
    
    const handleOpenChecklist = (data: { taskId: string, taskName: string, items: ChecklistItem[] }) => {
      onOpenChecklist(data.taskId, data.taskName, data.items);
    };
    
    const handleOpenJournal = (data: { taskId: string, taskName: string, entry: string }) => {
      onOpenJournal(data.taskId, data.taskName, data.entry);
    };
    
    const handleOpenVoiceRecorder = (data: { taskId: string, taskName: string }) => {
      onOpenVoiceRecorder(data.taskId, data.taskName);
    };
    
    // Register event listeners
    eventManager.on('task:show-image', handleShowImage);
    eventManager.on('task:open-checklist', handleOpenChecklist);
    eventManager.on('task:open-journal', handleOpenJournal);
    eventManager.on('task:open-voicenote', handleOpenVoiceRecorder);
    eventManager.on('task:update-specialized', onTaskUpdate);
    
    // Clean up
    return () => {
      eventManager.off('task:show-image', handleShowImage);
      eventManager.off('task:open-checklist', handleOpenChecklist);
      eventManager.off('task:open-journal', handleOpenJournal);
      eventManager.off('task:open-voicenote', handleOpenVoiceRecorder);
      eventManager.off('task:update-specialized', onTaskUpdate);
    };
  }, [onShowImage, onOpenChecklist, onOpenJournal, onOpenVoiceRecorder, onTaskUpdate]);
  
  return null;
};
