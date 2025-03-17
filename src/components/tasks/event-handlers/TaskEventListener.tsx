
import React, { useEffect } from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';

interface TaskEventListenerProps {
  onShowImage: (imageUrl: string, taskName: string) => void;
  onOpenChecklist: (taskId: string, taskName: string, items: any[]) => void;
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
    // Type for custom events that we'll need to handle
    type CustomEventWithDetail<T = any> = CustomEvent<T>;

    // Handle show image event
    const handleShowImage = (event: CustomEventWithDetail) => {
      const { imageUrl, taskName } = event.detail || {};
      if (imageUrl && taskName) {
        onShowImage(imageUrl, taskName);
      }
    };

    // Handle open checklist event
    const handleOpenChecklist = (event: CustomEventWithDetail) => {
      const { taskId, taskName, items } = event.detail || {};
      if (taskId && taskName && items) {
        onOpenChecklist(taskId, taskName, items);
      }
    };

    // Handle open journal event
    const handleOpenJournal = (event: CustomEventWithDetail) => {
      const { taskId, taskName, entry } = event.detail || {};
      if (taskId && taskName) {
        onOpenJournal(taskId, taskName, entry || '');
      }
    };

    // Handle open voice recorder event
    const handleOpenVoiceRecorder = (event: CustomEventWithDetail) => {
      const { taskId, taskName } = event.detail || {};
      if (taskId && taskName) {
        onOpenVoiceRecorder(taskId, taskName);
      }
    };

    // Handle task update event
    const handleTaskUpdateEvent = (data: { taskId: string, updates: Partial<Task> }) => {
      onTaskUpdate(data);
    };

    // Subscribe to events
    eventBus.on('task:update', handleTaskUpdateEvent);

    // Add event listeners for window events
    window.addEventListener('show-image', handleShowImage as EventListener);
    window.addEventListener('open-checklist', handleOpenChecklist as EventListener);
    window.addEventListener('open-journal', handleOpenJournal as EventListener);
    window.addEventListener('open-voice-recorder', handleOpenVoiceRecorder as EventListener);

    // Clean up event listeners
    return () => {
      eventBus.off('task:update', handleTaskUpdateEvent);
      window.removeEventListener('show-image', handleShowImage as EventListener);
      window.removeEventListener('open-checklist', handleOpenChecklist as EventListener);
      window.removeEventListener('open-journal', handleOpenJournal as EventListener);
      window.removeEventListener('open-voice-recorder', handleOpenVoiceRecorder as EventListener);
    };
  }, [onShowImage, onOpenChecklist, onOpenJournal, onOpenVoiceRecorder, onTaskUpdate]);

  // This component doesn't render anything
  return null;
};
