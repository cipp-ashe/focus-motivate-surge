
import React from 'react';
import { Task } from '@/types/tasks';
import { useEvent } from '@/hooks/useEvent';
import { useUnifiedTaskManager } from '@/hooks/tasks/useUnifiedTaskManager';

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
  // Use our new useEvent hook to subscribe to task:update events
  useEvent('task:update', onTaskUpdate);

  // Handle specialized events
  useEvent('task:show-image', (payload: { imageUrl: string, taskName: string }) => {
    const { imageUrl, taskName } = payload;
    if (imageUrl && taskName) {
      onShowImage(imageUrl, taskName);
    }
  });

  useEvent('task:open-checklist', (payload: { taskId: string, taskName: string, items: any[] }) => {
    const { taskId, taskName, items } = payload;
    if (taskId && taskName && items) {
      onOpenChecklist(taskId, taskName, items);
    }
  });

  useEvent('task:open-journal', (payload: { taskId: string, taskName: string, entry: string }) => {
    const { taskId, taskName, entry } = payload;
    if (taskId && taskName) {
      onOpenJournal(taskId, taskName, entry || '');
    }
  });

  useEvent('task:open-voice-recorder', (payload: { taskId: string, taskName: string }) => {
    const { taskId, taskName } = payload;
    if (taskId && taskName) {
      onOpenVoiceRecorder(taskId, taskName);
    }
  });

  // This component doesn't render anything
  return null;
};
