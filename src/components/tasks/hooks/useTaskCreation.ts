
import { useState } from 'react';
import { Task, TaskType } from '@/types/tasks';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';
import { eventManager } from '@/lib/events/EventManager';

interface UseTaskCreationProps {
  onTaskAdd: (task: Task) => void;
  onTasksAdd: (tasks: Task[]) => void;
  defaultTaskType?: TaskType;
}

export const useTaskCreation = ({ 
  onTaskAdd, 
  onTasksAdd, 
  defaultTaskType = 'regular' as TaskType
}: UseTaskCreationProps) => {
  const [taskName, setTaskName] = useState('');
  const [taskType, setTaskType] = useState<TaskType>(defaultTaskType);
  const [isAddingMultiple, setIsAddingMultiple] = useState(false);
  const [multipleTasksInput, setMultipleTasksInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const { toast } = useToast();

  const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
  };
  
  const handleTaskTypeChange = (value: string) => {
    setTaskType(value as TaskType);
  };
  
  const handleMultipleTasksInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMultipleTasksInput(e.target.value);
  };
  
  // Tag handlers
  const handleAddTag = (newTag: string) => {
    setTags([...tags, newTag]);
  };
  
  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleAddTask = () => {
    if (!taskName.trim()) {
      toast.error("Task name cannot be empty.", {
        duration: 3000,
      });
      return;
    }
    
    const newTask: Task = {
      id: uuidv4(),
      name: taskName,
      taskType: taskType,
      completed: false,
      createdAt: new Date().toISOString(),
      tags: tags.map(tag => ({ id: uuidv4(), name: tag }))
    };
    
    try {
      // Directly call the parent handler to update the context
      console.log("useTaskCreation: Created new task, calling onTaskAdd", newTask);
      onTaskAdd(newTask);
      
      // Also emit an event to ensure all components are notified
      eventManager.emit('task:create', newTask);
      
      // Trigger UI update events
      window.dispatchEvent(new CustomEvent('task-ui-refresh'));
      window.dispatchEvent(new Event('task-submit-complete'));
      
      resetForm();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error("Failed to create task. Please try again.");
    }
  };
  
  const handleAddMultipleTasks = () => {
    if (!multipleTasksInput.trim()) {
      toast.error("Multiple tasks input cannot be empty.", {
        duration: 3000,
      });
      return;
    }
    
    const taskNames = multipleTasksInput.split('\n').filter(name => name.trim() !== '');
    const newTasks: Task[] = taskNames.map(name => ({
      id: uuidv4(),
      name: name.trim(),
      taskType: taskType,
      completed: false,
      createdAt: new Date().toISOString(),
      tags: tags.map(tag => ({ id: uuidv4(), name: tag }))
    }));
    
    try {
      // Call the parent handler directly
      console.log("useTaskCreation: Created multiple tasks, calling onTasksAdd", newTasks);
      onTasksAdd(newTasks);
      
      // Also emit events for each task
      newTasks.forEach(task => {
        eventManager.emit('task:create', task);
      });
      
      // Trigger UI update events
      window.dispatchEvent(new CustomEvent('task-ui-refresh'));
      window.dispatchEvent(new Event('task-submit-complete'));
      
      resetForm();
      setIsAddingMultiple(false);
    } catch (error) {
      console.error('Error creating multiple tasks:', error);
      toast.error("Failed to create tasks. Please try again.");
    }
  };

  const resetForm = () => {
    setTaskName('');
    setTags([]);
  };

  const toggleMultipleInput = () => {
    setIsAddingMultiple(!isAddingMultiple);
  };

  return {
    taskName,
    taskType,
    isAddingMultiple,
    multipleTasksInput,
    tags,
    handleTaskNameChange,
    handleTaskTypeChange,
    handleMultipleTasksInputChange,
    handleAddTag,
    handleRemoveTag,
    handleAddTask,
    handleAddMultipleTasks,
    toggleMultipleInput
  };
};
