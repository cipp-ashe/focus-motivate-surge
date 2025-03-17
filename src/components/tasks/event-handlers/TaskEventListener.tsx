
import React, { useEffect, useCallback } from 'react';
import { Task } from '@/types/tasks';
import { useTaskContext } from '@/contexts/tasks/TaskContext';

interface TaskEventListenerProps {
  onShowImage: (imageUrl: string, taskName: string) => void;
  onOpenChecklist: (taskId: string, taskName: string, items: any[]) => void;
  onOpenJournal: (taskId: string, taskName: string, entry: string) => void;
  onOpenVoiceRecorder: (taskId: string, taskName: string) => void;
  onTaskUpdate: (data: { taskId: string, updates: Partial<Task> }) => void;
}

export const TaskEventListener: React.FC<TaskEventListenerProps> = React.memo(({
  onShowImage,
  onOpenChecklist,
  onOpenJournal,
  onOpenVoiceRecorder,
  onTaskUpdate
}) => {
  const { items: tasks } = useTaskContext();

  // Handle specialized task media viewing
  const handleShowImage = useCallback((data: { imageUrl: string, taskName: string }) => {
    onShowImage(data.imageUrl, data.taskName);
  }, [onShowImage]);

  const handleOpenChecklist = useCallback((data: { taskId: string, taskName: string, items: any[] }) => {
    onOpenChecklist(data.taskId, data.taskName, data.items);
  }, [onOpenChecklist]);
  
  const handleOpenJournal = useCallback((data: { taskId: string, taskName: string, entry: string }) => {
    onOpenJournal(data.taskId, data.taskName, data.entry);
  }, [onOpenJournal]);
  
  const handleOpenVoiceNote = useCallback((data: { taskId: string, taskName: string }) => {
    onOpenVoiceRecorder(data.taskId, data.taskName);
  }, [onOpenVoiceRecorder]);
  
  const handleTaskSpecializedUpdate = useCallback((data: { taskId: string, updates: Partial<Task> }) => {
    onTaskUpdate(data);
  }, [onTaskUpdate]);

  // Set up event listeners
  useEffect(() => {
    const eventHandlers = [
      { name: 'task:show-image', handler: handleShowImage },
      { name: 'task:open-checklist', handler: handleOpenChecklist },
      { name: 'task:open-journal', handler: handleOpenJournal },
      { name: 'task:open-voicenote', handler: handleOpenVoiceNote },
      { name: 'task:update-specialized', handler: handleTaskSpecializedUpdate }
    ];
    
    // Add event listeners
    eventHandlers.forEach(({ name, handler }) => {
      window.addEventListener(name, handler as EventListener);
    });
    
    // Remove event listeners
    return () => {
      eventHandlers.forEach(({ name, handler }) => {
        window.removeEventListener(name, handler as EventListener);
      });
    };
  }, [
    handleShowImage, 
    handleOpenChecklist, 
    handleOpenJournal, 
    handleOpenVoiceNote,
    handleTaskSpecializedUpdate
  ]);

  return null;
});

TaskEventListener.displayName = 'TaskEventListener';
