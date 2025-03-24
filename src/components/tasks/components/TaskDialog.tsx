
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Task, TaskType, TaskStatus } from '@/types/tasks';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { eventManager } from '@/lib/events/EventManager';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  onSave: (task: Partial<Task>) => void;
  mode?: 'create' | 'edit';
}

export const TaskDialog: React.FC<TaskDialogProps> = ({
  isOpen,
  onClose,
  task,
  onSave,
  mode = 'create'
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('regular');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [duration, setDuration] = useState<number>(1500); // 25 minutes default
  
  // Initialize form with task data when editing
  useEffect(() => {
    if (task && mode === 'edit') {
      setName(task.name || '');
      setDescription(task.description || '');
      setTaskType(task.taskType || 'regular');
      setStatus(task.status || 'pending');
      setDuration(task.duration || 1500);
    } else {
      // Reset form for new task
      setName('');
      setDescription('');
      setTaskType('regular');
      setStatus('pending');
      setDuration(1500);
    }
  }, [task, mode, isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedTask: Partial<Task> = {
      name,
      description,
      taskType,
      status,
      duration
    };
    
    onSave(updatedTask);
    onClose();
    
    // Emit event for analytics or other components
    eventManager.emit(mode === 'create' ? 'task:create' : 'task:update', {
      ...(task ? { taskId: task.id } : {}),
      ...(mode === 'create' ? updatedTask : { updates: updatedTask })
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New Task' : 'Edit Task'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Task Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter task name"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="taskType">Task Type</Label>
                <Select value={taskType} onValueChange={(value) => setTaskType(value as TaskType)}>
                  <SelectTrigger id="taskType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="timer">Timer</SelectItem>
                    <SelectItem value="checklist">Checklist</SelectItem>
                    <SelectItem value="journal">Journal</SelectItem>
                    <SelectItem value="habit">Habit</SelectItem>
                    <SelectItem value="focus">Focus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="started">Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="240"
                value={Math.floor(duration / 60)}
                onChange={(e) => setDuration(parseInt(e.target.value) * 60)}
                placeholder="Enter duration in minutes"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Create Task' : 'Update Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
