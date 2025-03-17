
import React, { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Check, 
  Clock, 
  Copy, 
  Repeat, 
  RefreshCw,
  Trash2 
} from 'lucide-react';
import { toast } from 'sonner';

interface TaskActionButtonProps {
  task: Task;
  actionType: 
    | 'complete' 
    | 'delete' 
    | 'timer' 
    | 'clone' 
    | 'schedule' 
    | 'repeat' 
    | 'reset';
  onActionComplete?: () => void;
}

export const TaskActionButton: React.FC<TaskActionButtonProps> = ({
  task,
  actionType,
  onActionComplete
}) => {
  // Define actions based on action type
  const handleAction = useCallback(() => {
    switch (actionType) {
      case 'complete':
        // Mark the task as completed
        eventManager.emit('task:complete', { taskId: task.id });
        toast.success(`Task completed: ${task.name}`);
        break;
        
      case 'delete':
        // Delete the task
        eventManager.emit('task:delete', { taskId: task.id });
        toast.success(`Task deleted: ${task.name}`);
        break;
        
      case 'timer':
        // Set task for timer
        eventManager.emit('timer:set-task', { 
          id: task.id, 
          name: task.name 
        });
        toast.success(`Timer set for: ${task.name}`);
        break;
        
      case 'clone':
        // Create a clone of the task
        const clonedTask = {
          ...task,
          id: crypto.randomUUID(),
          name: `Copy of ${task.name}`,
          completed: false,
          createdAt: new Date().toISOString()
        };
        
        // Emit the event to create a new task
        eventManager.emit('task:create', clonedTask);
        toast.success(`Task cloned: ${task.name}`);
        break;
        
      case 'schedule':
        // For future implementation - schedule the task
        toast.info('Schedule functionality coming soon');
        break;
        
      case 'repeat':
        // For future implementation - set task to repeat
        toast.info('Repeat functionality coming soon');
        break;
        
      case 'reset':
        // Reset the task to initial state
        eventManager.emit('task:update', {
          taskId: task.id,
          updates: {
            completed: false,
            progress: 0
          }
        });
        toast.success(`Task reset: ${task.name}`);
        break;
        
      default:
        console.error(`Unknown action type: ${actionType}`);
    }
    
    // Call the onActionComplete callback if provided
    if (onActionComplete) {
      onActionComplete();
    }
  }, [actionType, task, onActionComplete]);
  
  // Define button icon and variant based on action type
  const getButtonProps = () => {
    switch (actionType) {
      case 'complete':
        return { 
          icon: <Check className="h-4 w-4" />, 
          variant: 'success' as const,
          label: 'Complete' 
        };
      case 'delete':
        return { 
          icon: <Trash2 className="h-4 w-4" />, 
          variant: 'destructive' as const,
          label: 'Delete' 
        };
      case 'timer':
        return { 
          icon: <Clock className="h-4 w-4" />, 
          variant: 'default' as const,
          label: 'Timer' 
        };
      case 'clone':
        return { 
          icon: <Copy className="h-4 w-4" />, 
          variant: 'outline' as const,
          label: 'Clone' 
        };
      case 'schedule':
        return { 
          icon: <Calendar className="h-4 w-4" />, 
          variant: 'outline' as const,
          label: 'Schedule' 
        };
      case 'repeat':
        return { 
          icon: <Repeat className="h-4 w-4" />, 
          variant: 'outline' as const,
          label: 'Repeat' 
        };
      case 'reset':
        return { 
          icon: <RefreshCw className="h-4 w-4" />, 
          variant: 'secondary' as const,
          label: 'Reset' 
        };
      default:
        return { 
          icon: null, 
          variant: 'outline' as const,
          label: 'Action' 
        };
    }
  };
  
  const { icon, variant, label } = getButtonProps();
  
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleAction}
      className="h-8 text-xs"
    >
      {icon}
      <span className="ml-1">{label}</span>
    </Button>
  );
};
