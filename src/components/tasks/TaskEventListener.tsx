
import { useEffect, useRef } from 'react';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface TaskEventListenerProps {
  onShowImage: (imageUrl: string, taskName: string) => void;
  onOpenChecklist: (taskId: string, taskName: string, items: any[]) => void;
  onOpenJournal: (taskId: string, taskName: string, entry: string) => void;
  onOpenVoiceRecorder: (taskId: string, taskName: string) => void;
  onTaskUpdate: (data: { taskId: string; updates: Partial<Task> }) => void;
}

export const TaskEventListener: React.FC<TaskEventListenerProps> = ({
  onShowImage,
  onOpenChecklist,
  onOpenJournal,
  onOpenVoiceRecorder,
  onTaskUpdate
}) => {
  const navigate = useNavigate();
  const isModalOpenRef = useRef(false);
  
  useEffect(() => {
    console.log('TaskEventListener: Setting up event listeners');
    
    // Track last processed updates to prevent infinite loops
    const processedUpdates = new Map<string, {timestamp: number, updates: any}>();
    
    // Handler for opening screenshot/image viewer
    const handleOpenImage = (data: { taskId: string; imageUrl: string; taskName: string }) => {
      console.log('TaskEventListener: Received show-image event:', data);
      
      // Set the modal flag
      isModalOpenRef.current = true;
      
      // Call the handler
      onShowImage(data.imageUrl, data.taskName);
      
      // Reset the flag after a delay
      setTimeout(() => {
        isModalOpenRef.current = false;
      }, 500);
    };
    
    // Handler for opening checklist
    const handleOpenChecklist = (data: { taskId: string; taskName: string; items: any[] }) => {
      console.log('TaskEventListener: Received open-checklist event:', data);
      
      // Set the modal flag
      isModalOpenRef.current = true;
      
      // Call the handler
      onOpenChecklist(data.taskId, data.taskName, data.items || []);
      
      // Reset the flag after a delay
      setTimeout(() => {
        isModalOpenRef.current = false;
      }, 500);
    };
    
    // Handler for opening journal
    const handleOpenJournal = (data: { taskId: string; taskName: string; entry: string }) => {
      console.log('TaskEventListener: Received open-journal event:', data);
      
      // Set the modal flag
      isModalOpenRef.current = true;
      
      // Call the handler
      onOpenJournal(data.taskId, data.taskName, data.entry || '');
      
      // Reset the flag after a delay
      setTimeout(() => {
        isModalOpenRef.current = false;
      }, 500);
    };
    
    // Handler for opening voice recorder
    const handleOpenVoiceRecorder = (data: { taskId: string; taskName: string }) => {
      console.log('TaskEventListener: Received open-voice-recorder event:', data);
      
      // Set the modal flag
      isModalOpenRef.current = true;
      
      // Call the handler
      onOpenVoiceRecorder(data.taskId, data.taskName);
      
      // Reset the flag after a delay
      setTimeout(() => {
        isModalOpenRef.current = false;
      }, 500);
    };
    
    // Handler for task updates with strict loop prevention
    const handleTaskUpdate = (data: { taskId: string; updates: any }) => {
      const { taskId, updates } = data;
      
      // Skip if a modal is open to prevent interactions while dialogs are showing
      if (isModalOpenRef.current) {
        console.log('TaskEventListener: Skipping task update because a modal is open');
        return;
      }
      
      // Skip further processing if we don't have updates
      if (!updates || Object.keys(updates).length === 0) {
        return;
      }
      
      // Critical loop prevention - check if we've just processed this exact update
      const lastUpdateKey = `${taskId}-${JSON.stringify(updates)}`;
      const now = Date.now();
      const lastProcessed = processedUpdates.get(lastUpdateKey);
      
      if (lastProcessed && now - lastProcessed.timestamp < 2000) {
        console.log(`TaskEventListener: Skipping duplicate update for task ${taskId} (processed recently)`);
        return;
      }
      
      // Record this update to prevent duplicate processing
      processedUpdates.set(lastUpdateKey, { timestamp: now, updates });
      
      // Filter out special content properties to avoid UI update loops
      const filteredUpdates = { ...updates };
      delete filteredUpdates.journalEntry;
      delete filteredUpdates.checklistItems;
      delete filteredUpdates.imageUrl;
      delete filteredUpdates.voiceNoteUrl;
      
      // Only forward the update if we have properties left
      if (Object.keys(filteredUpdates).length > 0) {
        console.log('TaskEventListener: Forwarding filtered update to parent component', 
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
    };
    
    // Handler for timer task selection
    const handleTimerTaskSet = (task: Task) => {
      console.log('TaskEventListener: Timer task set event received for', task.id);
      
      // Only handle timer tasks
      if (task.taskType === 'timer') {
        // Navigate to timer page if not already there
        if (!window.location.pathname.includes('/timer')) {
          navigate('/timer');
        }
        
        // Send the task to the timer with a small delay
        setTimeout(() => {
          const event = new CustomEvent('timer:set-task', { detail: task });
          window.dispatchEvent(event);
        }, 300);
      } else {
        console.log('TaskEventListener: Ignoring non-timer task for timer page:', task);
      }
    };
    
    // Listen for direct DOM events for dialog opening
    const handleDomOpenJournal = (e: CustomEvent<{taskId: string, taskName: string, entry: string}>) => {
      console.log('TaskEventListener: Received DOM open-journal event:', e.detail);
      onOpenJournal(e.detail.taskId, e.detail.taskName, e.detail.entry || '');
    };
    
    const handleDomOpenChecklist = (e: CustomEvent<{taskId: string, taskName: string, items: any[]}>) => {
      console.log('TaskEventListener: Received DOM open-checklist event:', e.detail);
      onOpenChecklist(e.detail.taskId, e.detail.taskName, e.detail.items || []);
    };
    
    const handleDomShowImage = (e: CustomEvent<{imageUrl: string, taskName: string}>) => {
      console.log('TaskEventListener: Received DOM show-image event:', e.detail);
      onShowImage(e.detail.imageUrl, e.detail.taskName);
    };
    
    const handleDomOpenVoiceRecorder = (e: CustomEvent<{taskId: string, taskName: string}>) => {
      console.log('TaskEventListener: Received DOM open-voice-recorder event:', e.detail);
      onOpenVoiceRecorder(e.detail.taskId, e.detail.taskName);
    };
    
    // Handle the new force-ui-refresh event
    const handleForceUiRefresh = (e: CustomEvent<{taskId: string}>) => {
      console.log('TaskEventListener: Received force-ui-refresh event:', e.detail);
      // This event exists just to trigger a UI refresh without triggering task updates
    };
    
    // Set up event listeners
    const unsubscribers = [
      eventBus.on('show-image', handleOpenImage),
      eventBus.on('open-checklist', handleOpenChecklist),
      eventBus.on('open-journal', handleOpenJournal),
      eventBus.on('open-voice-recorder', handleOpenVoiceRecorder),
      eventBus.on('task:update', handleTaskUpdate),
      eventBus.on('timer:set-task', handleTimerTaskSet),
    ];
    
    // Add direct DOM event listeners
    window.addEventListener('open-journal', handleDomOpenJournal as EventListener);
    window.addEventListener('open-checklist', handleDomOpenChecklist as EventListener);
    window.addEventListener('show-image', handleDomShowImage as EventListener);
    window.addEventListener('open-voice-recorder', handleDomOpenVoiceRecorder as EventListener);
    window.addEventListener('force-ui-refresh', handleForceUiRefresh as EventListener);
    
    // Force a refresh at startup to ensure all is in sync
    window.dispatchEvent(new Event('force-task-update'));
    
    // Cleanup event listeners on unmount
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      window.removeEventListener('open-journal', handleDomOpenJournal as EventListener);
      window.removeEventListener('open-checklist', handleDomOpenChecklist as EventListener);
      window.removeEventListener('show-image', handleDomShowImage as EventListener);
      window.removeEventListener('open-voice-recorder', handleDomOpenVoiceRecorder as EventListener);
      window.removeEventListener('force-ui-refresh', handleForceUiRefresh as EventListener);
      console.log('TaskEventListener: Cleaned up event listeners');
    };
  }, [onShowImage, onOpenChecklist, onOpenJournal, onOpenVoiceRecorder, onTaskUpdate, navigate]);
  
  return null;
};
