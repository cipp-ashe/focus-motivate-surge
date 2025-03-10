
import { useState } from 'react';
import { Task, TaskType } from '@/types/tasks';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';
import { Tag } from '@/types/tasks';

interface UseTaskCreationProps {
  onTaskAdd: (task: Task) => void;
  onTasksAdd: (tasks: Task[]) => void;
  defaultTaskType?: TaskType;
}

export const useTaskCreation = ({ 
  onTaskAdd, 
  onTasksAdd, 
  defaultTaskType 
}: UseTaskCreationProps) => {
  const [taskName, setTaskName] = useState('');
  const [taskType, setTaskType] = useState<TaskType>(defaultTaskType || 'regular');
  const [isAddingMultiple, setIsAddingMultiple] = useState(false);
  const [multipleTasksInput, setMultipleTasksInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [habitId, setHabitId] = useState<string | null>(null);
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
      taskType: taskType || 'regular',
      completed: false,
      createdAt: new Date().toISOString(),
      tags: tags.map(tag => ({ id: uuidv4(), name: tag })),
      relationships: {
        habitId: habitId || undefined,
        date: date ? date.toISOString() : undefined
      }
    };
    
    onTaskAdd(newTask);
    resetForm();
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
      taskType: taskType || 'regular',
      completed: false,
      createdAt: new Date().toISOString(),
      tags: tags.map(tag => ({ id: uuidv4(), name: tag })),
      relationships: {
        habitId: habitId || undefined,
        date: date ? date.toISOString() : undefined
      }
    }));
    
    onTasksAdd(newTasks);
    resetForm();
    setIsAddingMultiple(false);
  };

  const resetForm = () => {
    setTaskName('');
    setTags([]);
    setHabitId(null);
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
    date,
    habitId,
    handleTaskNameChange,
    handleTaskTypeChange,
    handleMultipleTasksInputChange,
    handleAddTag,
    handleRemoveTag,
    handleAddTask,
    handleAddMultipleTasks,
    setDate,
    setHabitId,
    toggleMultipleInput
  };
};
