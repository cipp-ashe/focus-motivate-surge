
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Timer } from 'lucide-react';
import { createTaskOperations } from '@/lib/operations/tasks/create';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { eventManager } from '@/lib/events/EventManager';
import { logger } from '@/utils/logManager';
import { Task } from '@/types/tasks';

export const TimerTaskInput = () => {
  const [taskName, setTaskName] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskName.trim()) {
      toast.error('Please enter a task name');
      return;
    }
    
    logger.debug('TimerTaskInput', 'Creating timer task:', taskName);
    
    try {
      // Create a new timer task
      const newTask = createTaskOperations.createTask({
        name: taskName,
        taskType: 'timer',
        duration: 25 * 60, // Default to 25 minutes
        completed: false,
        createdAt: new Date().toISOString(),
        status: 'pending',
        tags: []
      }, {
        // Don't suppress toast notification so user knows task was created
        suppressToast: false,
        // Don't automatically select after create - let user select from list
        selectAfterCreate: false
      });
      
      // Clear the input
      setTaskName('');
      
      // Log the created task for debugging
      logger.debug('TimerTaskInput', 'Task created successfully:', newTask.id, newTask.name);
      
    } catch (error) {
      logger.error('TimerTaskInput', 'Error creating task:', error);
      toast.error('Failed to create timer task');
    }
  };

  return (
    <Card className="dark:bg-card/90 border-border/40 dark:border-border/20">
      <CardContent className="pt-4">
        <form onSubmit={handleAddTask} className="flex gap-2">
          <div className="flex-1 relative">
            <Timer className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Add a new timer task..."
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
