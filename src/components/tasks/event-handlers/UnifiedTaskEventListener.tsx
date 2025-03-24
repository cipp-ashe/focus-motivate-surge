
import React, { useRef } from 'react';
import { Task } from '@/types/task';
import { useEvent } from '@/hooks/useEvent';
import { useUnifiedMediaHandlers } from './useUnifiedMediaHandlers';

interface UnifiedTaskEventListenerProps {
  onShowImage: (imageUrl: string, taskName: string) => void;
  onOpenChecklist: (taskId: string, taskName: string, items: any[]) => void;
  onOpenJournal: (taskId: string, taskName: string, entry: string) => void;
  onOpenVoiceRecorder: (taskId: string, taskName: string) => void;
  onTaskUpdate: (data: { taskId: string, updates: Partial<Task> }) => void;
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
  onTaskUpdate
}) => {
  // Reference to track if a modal is open to prevent event loops
  const isModalOpenRef = useRef(false);

  // Use our unified media handlers
  const mediaHandlers = useUnifiedMediaHandlers({
    onShowImage,
    onOpenChecklist,
    onOpenJournal,
    onOpenVoiceRecorder,
    isModalOpenRef
  });
  
  // Task update handler with protection against loops when modal is open
  const handleTaskUpdate = (data: { taskId: string; updates: Partial<Task> }) => {
    // Skip updates while a modal is open to prevent loops
    if (isModalOpenRef.current) {
      console.log('UnifiedTaskEventListener: Skipping task update while modal is open');
      return;
    }
    
    // Forward the update to the parent component
    onTaskUpdate(data);
  };
  
  // Use our useEvent hook to listen for task:update events
  useEvent('task:update', handleTaskUpdate);

  // This component doesn't render anything
  return null;
};
