
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/types/tasks';
import { toast } from 'sonner';

interface TaskInputProps {
  onTaskAdd: (task: Task) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onTaskAdd }) => {
  const [inputValue, setInputValue] = useState('');
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addTask();
    }
  };
  
  const addTask = () => {
    if (!inputValue.trim()) return;
    
    const newTask: Task = {
      id: uuidv4(),
      name: inputValue.trim(),
      createdAt: new Date().toISOString(),
      completed: false,
      status: 'pending',
      taskType: 'regular'
    };
    
    onTaskAdd(newTask);
    setInputValue('');
    toast.success('Task created!');
  };
  
  return (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder="Add a new task..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />
      <Button onClick={addTask} className="shrink-0">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add
      </Button>
    </div>
  );
};

export default TaskInput;
