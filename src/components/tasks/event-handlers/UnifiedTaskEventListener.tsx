
import React, { useEffect } from 'react';
import { useEvent } from '@/hooks/useEvent';
import { logger } from '@/utils/logManager';

interface UnifiedTaskEventListenerProps {
  onShowImage?: (imageUrl: string, taskName: string) => void;
  onOpenChecklist?: (taskId: string, taskName: string, items: any[]) => void;
  onOpenJournal?: (taskId: string, taskName: string, entry: string) => void;
  onOpenVoiceRecorder?: (taskId: string, taskName: string) => void;
  onTaskUpdate?: (data: { taskId: string; updates: any }) => void;
}

export const UnifiedTaskEventListener: React.FC<UnifiedTaskEventListenerProps> = ({
  onShowImage,
  onOpenChecklist,
  onOpenJournal,
  onOpenVoiceRecorder,
  onTaskUpdate,
}) => {
  // Listen for task:show-image events
  useEvent('task:show-image', (payload: any) => {
    logger.debug('UnifiedTaskEventListener', 'task:show-image event received', payload);
    if (onShowImage && payload?.imageUrl && payload?.taskName) {
      onShowImage(payload.imageUrl, payload.taskName);
    }
  });

  // Listen for task:open-checklist events
  useEvent('task:open-checklist', (payload: any) => {
    logger.debug('UnifiedTaskEventListener', 'task:open-checklist event received', payload);
    if (onOpenChecklist && payload?.taskId && payload?.taskName && payload?.items) {
      onOpenChecklist(payload.taskId, payload.taskName, payload.items);
    }
  });

  // Listen for task:open-journal events
  useEvent('task:open-journal', (payload: any) => {
    logger.debug('UnifiedTaskEventListener', 'task:open-journal event received', payload);
    if (onOpenJournal && payload?.taskId && payload?.taskName && payload?.entry !== undefined) {
      onOpenJournal(payload.taskId, payload.taskName, payload.entry);
    }
  });

  // Listen for task:open-voice-recorder events
  useEvent('task:open-voice-recorder', (payload: any) => {
    logger.debug('UnifiedTaskEventListener', 'task:open-voice-recorder event received', payload);
    if (onOpenVoiceRecorder && payload?.taskId && payload?.taskName) {
      onOpenVoiceRecorder(payload.taskId, payload.taskName);
    }
  });

  // Listen for task:update events
  useEvent('task:update', (payload: any) => {
    logger.debug('UnifiedTaskEventListener', 'task:update event received', payload);
    if (onTaskUpdate && payload?.taskId && payload?.updates) {
      onTaskUpdate({ taskId: payload.taskId, updates: payload.updates });
    }
  });

  return null;
};
