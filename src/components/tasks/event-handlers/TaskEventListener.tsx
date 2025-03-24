
import React, { useEffect } from 'react';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';

interface TaskEventListenerProps {
  onShowImage?: (imageUrl: string, taskName: string) => void;
  onOpenChecklist?: (taskId: string, taskName: string, items: any[]) => void;
  onOpenJournal?: (taskId: string, taskName: string, entry: string) => void;
  onOpenVoiceRecorder?: (taskId: string, taskName: string) => void;
  onTaskUpdate?: (data: { taskId: string, updates: Partial<Task> }) => void;
}

export const TaskEventListener: React.FC<TaskEventListenerProps> = ({
  onShowImage,
  onOpenChecklist,
  onOpenJournal,
  onOpenVoiceRecorder,
  onTaskUpdate
}) => {
  useEffect(() => {
    // Set up event handlers
    const handleShowImage = (payload: any) => {
      if (onShowImage && payload && payload.imageUrl) {
        onShowImage(payload.imageUrl, payload.taskName || 'Image View');
      }
    };

    const handleOpenChecklist = (payload: any) => {
      if (onOpenChecklist && payload && payload.taskId) {
        onOpenChecklist(
          payload.taskId, 
          payload.taskName || 'Checklist', 
          payload.items || []
        );
      }
    };

    const handleOpenJournal = (payload: any) => {
      if (onOpenJournal && payload && payload.taskId) {
        onOpenJournal(
          payload.taskId, 
          payload.taskName || 'Journal', 
          payload.entry || ''
        );
      }
    };

    const handleOpenVoiceRecorder = (payload: any) => {
      if (onOpenVoiceRecorder && payload && payload.taskId) {
        onOpenVoiceRecorder(
          payload.taskId, 
          payload.taskName || 'Voice Note'
        );
      }
    };

    const handleTaskUpdate = (payload: any) => {
      if (onTaskUpdate && payload && payload.taskId) {
        onTaskUpdate({
          taskId: payload.taskId,
          updates: payload.updates || {}
        });
      }
    };

    // Register event listeners
    const unsubShowImage = eventManager.on('task:show-image', handleShowImage);
    const unsubOpenChecklist = eventManager.on('task:open-checklist', handleOpenChecklist);
    const unsubOpenJournal = eventManager.on('task:open-journal', handleOpenJournal);
    const unsubOpenVoiceRecorder = eventManager.on('task:open-voicenote', handleOpenVoiceRecorder);
    const unsubTaskUpdate = eventManager.on('task:update', handleTaskUpdate);

    return () => {
      // Unregister event listeners on cleanup
      unsubShowImage();
      unsubOpenChecklist();
      unsubOpenJournal();
      unsubOpenVoiceRecorder();
      unsubTaskUpdate();
    };
  }, [onShowImage, onOpenChecklist, onOpenJournal, onOpenVoiceRecorder, onTaskUpdate]);

  // This component doesn't render anything
  return null;
};
