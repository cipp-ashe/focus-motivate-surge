
import { useState, useCallback, RefObject } from 'react';
import { Task } from '@/types/tasks';

export const useTaskUpdateHandler = (
  onTaskUpdate: (data: { taskId: string; updates: Partial<Task> }) => void,
  isModalOpenRef: RefObject<boolean>
) => {
  // Track processed updates with timestamps for effective debouncing
  const [processedUpdates] = useState<Map<string, {timestamp: number, updates: any}>>(new Map());
  
  // Handler for task updates with strict loop prevention
  const processTaskUpdate = useCallback((data: { taskId: string; updates: any }) => {
    const { taskId, updates } = data;
    
    // Skip if a modal is open to prevent interactions while dialogs are showing
    if (isModalOpenRef.current) {
      console.log('TaskUpdateHandler: Skipping task update because a modal is open');
      return;
    }
    
    // Skip further processing if we don't have updates
    if (!updates || Object.keys(updates).length === 0) {
      return;
    }
    
    // Critical loop prevention - check if we've just processed this exact update
    const updateKey = `${taskId}-${JSON.stringify(updates)}`;
    const now = Date.now();
    const lastProcessed = processedUpdates.get(updateKey);
    
    if (lastProcessed && now - lastProcessed.timestamp < 2000) {
      console.log(`TaskUpdateHandler: Skipping duplicate update for task ${taskId} (processed recently)`);
      return;
    }
    
    // Record this update to prevent duplicate processing
    processedUpdates.set(updateKey, { timestamp: now, updates });
    
    // Filter out special content properties to avoid UI update loops
    const filteredUpdates = { ...updates };
    delete filteredUpdates.journalEntry;
    delete filteredUpdates.checklistItems;
    delete filteredUpdates.imageUrl;
    delete filteredUpdates.voiceNoteUrl;
    
    // Only forward the update if we have properties left
    if (Object.keys(filteredUpdates).length > 0) {
      console.log('TaskUpdateHandler: Forwarding filtered update to parent component', 
        { taskId, updates: filteredUpdates });
      onTaskUpdate({ taskId, updates: filteredUpdates });
    }
    
    // Clean up old entries to prevent memory leaks
    if (processedUpdates.size > 50) {
      const keysToDelete = Array.from(processedUpdates.entries())
        .filter(([_, data]) => now - data.timestamp > 10000)
        .map(([key]) => key);
      
      keysToDelete.forEach(key => processedUpdates.delete(key));
    }
  }, [onTaskUpdate, isModalOpenRef, processedUpdates]);

  return { processTaskUpdate };
};
