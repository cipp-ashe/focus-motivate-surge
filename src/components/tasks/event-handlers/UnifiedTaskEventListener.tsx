
import React, { useRef } from 'react';
import { useEvent } from '@/hooks/useEvent';
import { useUnifiedMediaHandlers } from './useUnifiedMediaHandlers';
import { useTaskEvents } from '@/hooks/tasks';
import { logger } from '@/utils/logManager';

interface UnifiedTaskEventListenerProps {
  onShowImage?: (imageUrl: string, taskName: string) => void;
  onOpenChecklist?: (taskId: string, taskName: string, items: any[]) => void;
  onOpenJournal?: (taskId: string, taskName: string, entry: string) => void;
  onOpenVoiceRecorder?: (taskId: string, taskName: string) => void;
  onTaskUpdate?: (data: { taskId: string; updates: any }) => void;
}

/**
 * Unified component for listening to task-related events
 * 
 * This component consolidates all task event handling in one place
 */
export const UnifiedTaskEventListener: React.FC<UnifiedTaskEventListenerProps> = ({
  onShowImage,
  onOpenChecklist,
  onOpenJournal,
  onOpenVoiceRecorder,
  onTaskUpdate,
}) => {
  // Reference to track if a modal is open to prevent event loops
  const isModalOpenRef = useRef(false);
  
  // Use our unified task events hook
  const { onTaskUpdate: subscribeToTaskUpdate } = useTaskEvents();
  
  // Use our unified media handlers
  const mediaHandlers = useUnifiedMediaHandlers({
    onShowImage,
    onOpenChecklist,
    onOpenJournal,
    onOpenVoiceRecorder,
    isModalOpenRef
  });
  
  // Task update handler with protection against loops when modal is open
  const handleTaskUpdate = (data: { taskId: string; updates: any }) => {
    // Skip updates while a modal is open to prevent loops
    if (isModalOpenRef.current) {
      logger.debug('UnifiedTaskEventListener', 'Skipping task update while modal is open');
      return;
    }
    
    // Forward the update to the parent component
    if (onTaskUpdate) {
      onTaskUpdate(data);
    }
  };
  
  // Use our subscribeToTaskUpdate function from the hook
  useEvent('task:update', handleTaskUpdate);
  
  // This component doesn't render anything
  return null;
};
