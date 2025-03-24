
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Task, TaskType } from '@/types/tasks';
import { TaskTypeSelector } from './TaskTypeSelector';

interface TaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSave: (task: Task) => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

export const TaskDialog: React.FC<TaskDialogProps> = ({
  isOpen,
  onOpenChange,
  task,
  onSave,
  onCancel,
  mode = 'create'
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('regular');
  
  // Reset form when task changes or dialog opens/closes
  useEffect(() => {
    if (isOpen && task) {
      setName(task.name || '');
      setDescription(task.description || '');
      setTaskType(task.taskType || 'regular');
    } else if (isOpen && !task) {
      // Reset form for new task
      setName('');
      setDescription('');
      setTaskType('regular');
    }
  }, [isOpen, task]);
  
  const handleSave = () => {
    if (!name.trim()) return;
    
    const updatedTask: Task = {
      ...task,
      name: name.trim(),
      description: description.trim(),
      taskType
    } as Task;
    
    onSave(updatedTask);
    onOpenChange(false);
  };
  
  const handleCancel = () => {
    if (onCancel) onCancel();
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create Task' : 'Edit Task'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Add a new task to your list' 
              : 'Update the details of your task'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Task Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter task name"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Task Type
            </label>
            <TaskTypeSelector
              value={taskType}
              onChange={setTaskType}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
