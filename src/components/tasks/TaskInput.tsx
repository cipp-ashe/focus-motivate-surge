
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskType } from '@/types/tasks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TaskTypeSelector } from './TaskTypeSelector';
import { Timer, Image, Calendar, FileText } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskInputProps {
  onTaskAdd: (task: Task) => void;
  onTasksAdd: (tasks: Task[]) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onTaskAdd, onTasksAdd }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('regular');
  const [duration, setDuration] = useState(25); // Default 25 minutes

  const handleAddTask = () => {
    if (!taskName.trim()) return;

    const newTask: Task = {
      id: uuidv4(),
      name: taskName.trim(),
      description: taskDescription.trim() || undefined,
      taskType: taskType,
      completed: false,
      createdAt: new Date().toISOString(),
      // Only add duration for timer tasks
      ...(taskType === 'timer' ? { duration: duration * 60 } : {})
    };

    onTaskAdd(newTask);
    resetForm();
  };

  const resetForm = () => {
    setTaskName('');
    setTaskDescription('');
    setTaskType('regular');
    setDuration(25);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="task-name">Task Name</Label>
          <Input
            id="task-name"
            placeholder="Enter task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="task-description">Description (Optional)</Label>
          <Textarea
            id="task-description"
            placeholder="Add details about this task"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            rows={2}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="task-type">Task Type</Label>
          <TaskTypeSelector 
            value={taskType} 
            onChange={setTaskType} 
          />
        </div>
        
        {taskType === 'timer' && (
          <div className="grid gap-2">
            <Label htmlFor="task-duration">Duration (minutes)</Label>
            <Input
              id="task-duration"
              type="number"
              min={1}
              max={120}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
        )}
      </div>
      
      <Button onClick={handleAddTask} disabled={!taskName.trim()}>
        Add Task
      </Button>
    </div>
  );
};
