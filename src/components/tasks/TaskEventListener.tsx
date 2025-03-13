
import React, { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Task, ChecklistItem } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';

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
  const isMounted = useRef(true);
  
  useEffect(() => {
    const handleShowImage = (event: Event) => {
      if (!isMounted.current) return;
      
      const customEvent = event as CustomEvent;
      const { imageUrl, taskName } = customEvent.detail;
      
      onShowImage(imageUrl, taskName);
      console.log("TaskEventListener - Received show-image event for:", taskName);
    };
    
    const handleOpenChecklist = (event: Event) => {
      if (!isMounted.current) return;
      
      const customEvent = event as CustomEvent;
      const { taskId, taskName, items } = customEvent.detail;
      
      console.log('TaskEventListener - Received open-checklist event:', { taskId, taskName, items });
      onOpenChecklist(taskId, taskName, Array.isArray(items) ? items : []);
    };
    
    const handleOpenJournal = (event: Event) => {
      if (!isMounted.current) return;
      
      const customEvent = event as CustomEvent;
      const { taskId, taskName, entry } = customEvent.detail;
      
      console.log('TaskEventListener - Received open-journal event:', { taskId, taskName, entry });
      onOpenJournal(taskId, taskName, entry || '');
    };
    
    const handleOpenVoiceRecorder = (event: Event) => {
      if (!isMounted.current) return;
      
      const customEvent = event as CustomEvent;
      const { taskId, taskName } = customEvent.detail;
      
      onOpenVoiceRecorder(taskId, taskName);
      console.log("TaskEventListener - Received open-voice-recorder event for:", taskName);
    };
    
    const handleTaskUpdate = (event: Event) => {
      if (!isMounted.current) return;
      
      const customEvent = event as CustomEvent;
      const { taskId, updates } = customEvent.detail;
      
      console.log('TaskEventListener - Received task-update event:', { taskId, updates });
      onTaskUpdate(taskId, updates);
    };
    
    console.log('TaskEventListener - Setting up event listeners');
    
    window.addEventListener('show-image', handleShowImage);
    window.addEventListener('open-checklist', handleOpenChecklist);
    window.addEventListener('open-journal', handleOpenJournal);
    window.addEventListener('open-voice-recorder', handleOpenVoiceRecorder);
    window.addEventListener('task-update', handleTaskUpdate);
    
    return () => {
      isMounted.current = false;
      window.removeEventListener('show-image', handleShowImage);
      window.removeEventListener('open-checklist', handleOpenChecklist);
      window.removeEventListener('open-journal', handleOpenJournal);
      window.removeEventListener('open-voice-recorder', handleOpenVoiceRecorder);
      window.removeEventListener('task-update', handleTaskUpdate);
    };
  }, [onShowImage, onOpenChecklist, onOpenJournal, onOpenVoiceRecorder, onTaskUpdate]);
  
  return null;
};
