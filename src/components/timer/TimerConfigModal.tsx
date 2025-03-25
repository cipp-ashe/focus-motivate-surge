
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MinutesInput } from '@/components/minutes/MinutesInput';
import { Clock, Play } from 'lucide-react';
import { createTaskOperations } from '@/lib/operations/tasks/create';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { logger } from '@/utils/logManager';

interface TimerConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTaskName?: string;
  initialMinutes?: number;
}

export const TimerConfigModal = ({ 
  open, 
  onOpenChange, 
  initialTaskName = '', 
  initialMinutes = 25 
}: TimerConfigModalProps) => {
  const [taskName, setTaskName] = useState(initialTaskName);
  const [minutes, setMinutes] = useState(initialMinutes);
  
  // Update state when props change
  useEffect(() => {
    if (open) {
      setTaskName(initialTaskName);
      setMinutes(initialMinutes);
    }
  }, [open, initialTaskName, initialMinutes]);

  const handleStartTimer = () => {
    logger.debug('TimerConfigModal', 'Starting timer with', { taskName, minutes });
    
    // If no task name is provided, use a default name
    const name = taskName.trim() || `Quick Timer (${minutes} min)`;
    
    // Create a new timer task
    const newTask = createTaskOperations.createTask({
      name,
      taskType: 'timer',
      duration: minutes * 60,
      completed: false,
      createdAt: new Date().toISOString(),
      status: 'pending',
      tags: []
    }, {
      suppressToast: true,
      selectAfterCreate: true
    });
    
    // Emit event to select and start the timer
    eventManager.emit('timer:set-task', {
      id: newTask.id,
      name: newTask.name,
      duration: newTask.duration || minutes * 60,
      completed: newTask.completed || false,
      createdAt: newTask.createdAt
    });
    
    toast.success(`Starting ${minutes} minute timer`, {
      description: `"${name}" timer started`
    });
    
    // Close the modal
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Configure Timer
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="task-name" className="text-sm font-medium">
              Task Name (optional)
            </label>
            <Input
              id="task-name"
              placeholder="What are you focusing on?"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Timer Duration
            </label>
            <div className="flex justify-center py-2">
              <MinutesInput
                minutes={minutes}
                onMinutesChange={setMinutes}
                minMinutes={1}
                maxMinutes={120}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleStartTimer} className="gap-2">
            <Play className="h-4 w-4" />
            Start Timer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
