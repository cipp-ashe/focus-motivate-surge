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
    
    // Use a Map with task IDs as keys to track last update time and status
    const lastUpdates = new Map<string, {status?: string, timestamp: number}>();
    
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
      }, 100);
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
      }, 100);
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
      }, 100);
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
      }, 100);
    };
    
    // Improved handler for task updates with strict loop prevention
    const handleTaskUpdate = (data: { taskId: string; updates: any }) => {
      // Skip if a modal is open to prevent interactions while dialogs are showing
      if (isModalOpenRef.current) {
        console.log('TaskEventListener: Skipping task update because a modal is open');
        return;
      }
      
      const { taskId, updates } = data;
      
      // Skip further processing if we don't have updates
      if (!updates || Object.keys(updates).length === 0) {
        return;
      }
      
      // Check if this is a status update to detect potential loops
      if (updates.status) {
        const lastUpdate = lastUpdates.get(taskId);
        const now = Date.now();
        
        // If we have a recent update with the same status, skip to prevent loops
        if (lastUpdate && 
            lastUpdate.status === updates.status && 
            now - lastUpdate.timestamp < 2000) { // Use a longer cooldown period
          console.log(`TaskEventListener: Ignoring duplicate status update for task ${taskId} to "${updates.status}" (debounced)`);
          return;
        }
        
        // Record this update to prevent rapid duplicate updates
        lastUpdates.set(taskId, { status: updates.status, timestamp: now });
        console.log(`TaskEventListener: Status update to "${updates.status}" for task ${taskId}`);
      }
      
      console.log('TaskEventListener: Task update event received', data);
      
      // Only forward status updates or non-special properties
      // Don't forward special content properties to avoid UI update loops
      const filteredUpdates = { ...updates };
      delete filteredUpdates.journalEntry;
      delete filteredUpdates.checklistItems;
      delete filteredUpdates.imageUrl;
      delete filteredUpdates.voiceNoteUrl;
      
      // Only forward the update if we have properties left
      if (Object.keys(filteredUpdates).length > 0) {
        // Forward filtered updates to parent handler
        onTaskUpdate({ taskId, updates: filteredUpdates });
      }
    };
    
    // Handler for timer task selection - Only navigate to timer for timer tasks
    const handleTimerTaskSet = (task: Task) => {
      console.log('TaskEventListener: Timer task set event received for', task.id);
      
      // Only handle timer tasks, do not convert other task types
      if (task.taskType === 'timer') {
        // Navigate to timer page if not already there
        if (!window.location.pathname.includes('/timer')) {
          navigate('/timer');
        }
        
        // Send the task to the timer without modifying its type
        setTimeout(() => {
          const event = new CustomEvent('timer:set-task', { detail: task });
          window.dispatchEvent(event);
        }, 300); // Small delay to ensure navigation completes first
      } else {
        console.log('TaskEventListener: Ignoring non-timer task for timer page:', task);
      }
    };
    
    // Also listen for direct DOM events for dialog opening
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
    
    // Force a refresh at startup to ensure all is in sync
    window.dispatchEvent(new Event('force-task-update'));
    
    // Cleanup event listeners on unmount
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      window.removeEventListener('open-journal', handleDomOpenJournal as EventListener);
      window.removeEventListener('open-checklist', handleDomOpenChecklist as EventListener);
      window.removeEventListener('show-image', handleDomShowImage as EventListener);
      window.removeEventListener('open-voice-recorder', handleDomOpenVoiceRecorder as EventListener);
      console.log('TaskEventListener: Cleaned up event listeners');
    };
  }, [onShowImage, onOpenChecklist, onOpenJournal, onOpenVoiceRecorder, onTaskUpdate, navigate]);
  
  return null;
};
