
import React from 'react';
import { Button } from '@/components/ui/button';
import { TimerIcon } from 'lucide-react';
import { TaskButtonProps } from './ButtonTypes';
import { useNavigate } from 'react-router-dom';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';

export interface TimerButtonProps extends TaskButtonProps {}

export const TimerButton: React.FC<TimerButtonProps> = ({ task, onTaskAction }) => {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    console.log(`Timer button clicked directly for task: ${task.id}, type: ${task.taskType}`);
    
    // Emit task select event before navigation to ensure it's selected
    eventManager.emit('task:select', task.id);
    
    // First navigate to the timer route
    navigate('/timer');
    
    // After a small delay to ensure navigation happens
    setTimeout(() => {
      // Emit the timer event with task details
      eventManager.emit('timer:set-task', task);
      toast.success(`Timer set for: ${task.name}`);
    }, 100);
    
    // Also call the normal task action
    if (onTaskAction) {
      onTaskAction(e, 'timer');
    }
  };

  return (
    <Button 
      variant="ghost"
      size="sm"
      className="h-7 w-7 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-100"
      onClick={handleClick}
      title="Start Timer"
    >
      <TimerIcon className="h-4 w-4" />
    </Button>
  );
};
