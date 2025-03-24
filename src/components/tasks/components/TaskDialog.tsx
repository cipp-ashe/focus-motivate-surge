
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { TaskTypeSelector } from './TaskTypeSelector';
import { toast } from 'sonner';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTask?: Task | null;
  onSaveTask?: (task: Task) => void;
}

export const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  onOpenChange,
  initialTask,
  onSaveTask
}) => {
  const [task, setTask] = useState<Partial<Task>>({
    name: '',
    taskType: 'regular',
    completed: false,
    createdAt: new Date().toISOString()
  });
  
  // Update local state when initialTask changes
  useEffect(() => {
    if (initialTask) {
      setTask(initialTask);
    } else {
      setTask({
        name: '',
        taskType: 'regular',
        completed: false,
        createdAt: new Date().toISOString()
      });
    }
  }, [initialTask, open]);
  
  const handleSave = () => {
    if (!task.name) {
      toast.error('Task name is required');
      return;
    }
    
    if (initialTask) {
      // Update existing task
      eventManager.emit('task:update', {
        taskId: initialTask.id,
        updates: task
      });
    } else {
      // Create new task
      const newTask: Task = {
        id: uuidv4(),
        name: task.name || 'New Task',
        description: task.description || '',
        taskType: task.taskType || 'regular',
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      eventManager.emit('task:create', newTask);
      
      if (onSaveTask) {
        onSaveTask(newTask);
      }
    }
    
    // Close the dialog
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Task Name
            </label>
            <Input
              id="name"
              value={task.name || ''}
              onChange={(e) => setTask({ ...task, name: e.target.value })}
              placeholder="Enter task name"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </label>
            <Input
              id="description"
              value={task.description || ''}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              placeholder="Enter description"
            />
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Task Type
            </label>
            <TaskTypeSelector
              value={task.taskType || 'regular'}
              onChange={(type) => setTask({ ...task, taskType: type })}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {initialTask ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
