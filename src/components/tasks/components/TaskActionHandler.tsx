
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { useCallback } from 'react';

export const useTaskActionHandler = (
  task: Task,
  onOpenTaskDialog?: () => void
) => {
  const handleTaskAction = useCallback((e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLElement>, actionType?: string) => {
    // Ensure proper event handling
    if (e && e.stopPropagation) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    // Get the action type from the parameter or clicked element
    const action = actionType || 
      (e.currentTarget instanceof HTMLElement 
        ? e.currentTarget.getAttribute('data-action-type') 
        : null);
      
    console.log("Task action:", action, "for task:", task.id, "onOpenTaskDialog available:", !!onOpenTaskDialog);
    
    // Handle status changes via the dropdown
    if (action?.startsWith('status-')) {
      const newStatus = action.replace('status-', '') as 'pending' | 'started' | 'in-progress' | 'delayed' | 'completed' | 'dismissed';
      console.log(`Changing task ${task.id} status to: ${newStatus}`);
      
      if (newStatus === 'completed') {
        // For completed status, use the task:complete event
        eventBus.emit('task:complete', { taskId: task.id });
        toast.success(`Task ${task.name} marked as complete`);
      } else if (newStatus === 'dismissed') {
        // For dismissed status, use the task:dismiss event if it's a habit task
        if (task.relationships?.habitId) {
          eventBus.emit('task:dismiss', { 
            taskId: task.id, 
            habitId: task.relationships.habitId,
            date: task.relationships.date || new Date().toDateString() 
          });
          toast.success(`Dismissed habit task: ${task.name}`);
        } else {
          // For regular tasks, just mark as dismissed
          eventBus.emit('task:update', { 
            taskId: task.id, 
            updates: { status: 'dismissed', dismissedAt: new Date().toISOString() } 
          });
          // Then move to completed
          setTimeout(() => {
            eventBus.emit('task:complete', { taskId: task.id });
          }, 100);
          toast.success(`Dismissed task: ${task.name}`);
        }
      } else {
        // For other statuses, just update the task
        eventBus.emit('task:update', { 
          taskId: task.id, 
          updates: { status: newStatus } 
        });
        toast.success(`Task ${task.name} marked as ${newStatus.replace('-', ' ')}`);
      }
      return; // Exit early after handling the status change
    }
    
    // Handle habit-related tasks
    if (task.relationships?.habitId && action === 'view-habit') {
      if (task.relationships?.habitId) {
        window.location.href = `/habits?habitId=${task.relationships.habitId}`;
      } else {
        toast.info(`Viewing habit task: ${task.name}`);
      }
      return;
    }
    
    // Handle journal tasks - specific handling for open-journal action
    if (action === 'open-journal') {
      console.log("Opening journal for task:", task.id);
      
      if (!onOpenTaskDialog) {
        console.error('No dialog opener provided for journal task:', task.id);
        toast.error('Unable to open journal editor');
        return;
      }
      
      // Make sure we set in-progress status if not already
      if (task.status !== 'in-progress') {
        eventBus.emit('task:update', { 
          taskId: task.id, 
          updates: { status: 'in-progress' } 
        });
      }
      
      // Dispatch the event to open the journal dialog
      window.dispatchEvent(new CustomEvent('open-journal', {
        detail: {
          taskId: task.id,
          taskName: task.name,
          entry: task.journalEntry || ''
        }
      }));
      
      console.log("Triggering journal dialog for task:", task.id);
      onOpenTaskDialog(); // Call the opener function directly
      return;
    }
    
    // Process specific task types when action button is clicked
    switch(task.taskType) {
      case 'timer':
        if (action === 'true') {
          // Set task to in-progress first
          if (task.status !== 'in-progress') {
            eventBus.emit('task:update', { 
              taskId: task.id, 
              updates: { status: 'in-progress' } 
            });
          }
          
          // Then initialize timer
          eventManager.emit('timer:init', { 
            taskName: task.name, 
            duration: task.duration || 1500 
          });
        }
        break;
        
      case 'journal':
        if (action === 'true') {
          // The journal handling is now done in the open-journal action block above
          // This redirects to that handler
          handleTaskAction(e, 'open-journal');
        }
        break;
        
      case 'screenshot':
        if (action === 'true') {
          // Mark as in-progress when opening these task types
          if (task.status !== 'in-progress') {
            eventBus.emit('task:update', { 
              taskId: task.id, 
              updates: { status: 'in-progress' } 
            });
          }
          
          // Open the appropriate dialog
          if (onOpenTaskDialog) {
            console.log(`Opening screenshot dialog for task:`, task.id);
            
            // Dispatch the event to open the screenshot dialog
            window.dispatchEvent(new CustomEvent('show-image', {
              detail: {
                taskId: task.id,
                taskName: task.name,
                imageUrl: task.imageUrl || ''
              }
            }));
            
            onOpenTaskDialog(); // Call the opener function directly
          } else {
            console.error(`No dialog opener provided for screenshot task:`, task.id);
            toast.error(`Unable to open screenshot editor`);
          }
        }
        break;
        
      case 'checklist':
        if (action === 'true') {
          // Mark as in-progress when opening these task types
          if (task.status !== 'in-progress') {
            eventBus.emit('task:update', { 
              taskId: task.id, 
              updates: { status: 'in-progress' } 
            });
          }
          
          // Open the appropriate dialog
          if (onOpenTaskDialog) {
            console.log(`Opening checklist dialog for task:`, task.id);
            
            // Dispatch the event to open the checklist dialog
            window.dispatchEvent(new CustomEvent('open-checklist', {
              detail: {
                taskId: task.id,
                taskName: task.name,
                items: task.checklistItems || []
              }
            }));
            
            onOpenTaskDialog(); // Call the opener function directly
          } else {
            console.error(`No dialog opener provided for checklist task:`, task.id);
            toast.error(`Unable to open checklist editor`);
          }
        }
        break;
        
      case 'voicenote':
        if (action === 'true') {
          // Mark as in-progress when opening these task types
          if (task.status !== 'in-progress') {
            eventBus.emit('task:update', { 
              taskId: task.id, 
              updates: { status: 'in-progress' } 
            });
          }
          
          // Open the appropriate dialog
          if (onOpenTaskDialog) {
            console.log(`Opening voicenote dialog for task:`, task.id);
            
            // Dispatch the event to open the voicenote dialog
            window.dispatchEvent(new CustomEvent('open-voice-recorder', {
              detail: {
                taskId: task.id,
                taskName: task.name,
                voiceNoteUrl: task.voiceNoteUrl || ''
              }
            }));
            
            onOpenTaskDialog(); // Call the opener function directly
          } else {
            console.error(`No dialog opener provided for voicenote task:`, task.id);
            toast.error(`Unable to open voicenote editor`);
          }
        }
        break;
        
      default:
        // Regular tasks just get completed directly if action button is clicked
        if (action === 'true') {
          eventBus.emit('task:complete', { taskId: task.id });
          toast.success(`Completed task: ${task.name}`);
        }
        break;
    }
  }, [task, onOpenTaskDialog]);

  const handleDelete = useCallback((e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (task.relationships?.habitId) {
      eventBus.emit('task:dismiss', { 
        taskId: task.id, 
        habitId: task.relationships.habitId,
        date: task.relationships.date || new Date().toDateString() 
      });
      
      toast.success(`Dismissed habit task for today: ${task.name}`, {
        description: "You won't see this habit task today"
      });
    } else {
      eventBus.emit('task:delete', { taskId: task.id, reason: 'manual' });
    }
  }, [task]);

  return { handleTaskAction, handleDelete };
};
