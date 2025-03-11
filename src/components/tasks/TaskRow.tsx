
import { Task } from "@/types/tasks";
import { useState, useEffect } from "react";
import { TaskContent } from "./TaskContent";
import { eventBus } from "@/lib/eventBus";
import { Card } from "@/components/ui/card";

interface TaskRowProps {
  task: Task;
  isSelected: boolean;
  editingTaskId: string | null;
  onTaskClick: (task: Task, event: React.MouseEvent<HTMLDivElement>) => void;
  onTaskDelete: (taskId: string) => void;
  onDurationChange: (taskId: string, newDuration: string) => void;
  onDurationClick: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>, taskId: string) => void;
  onInputBlur: () => void;
}

export const TaskRow = ({
  task,
  isSelected,
  editingTaskId,
  onTaskClick,
  onTaskDelete,
  onDurationChange,
  onDurationClick,
  onInputBlur,
}: TaskRowProps) => {
  const durationInMinutes = Math.round(Number(task.duration || 1500) / 60);
  const [inputValue, setInputValue] = useState(durationInMinutes.toString());

  useEffect(() => {
    if (task.duration) {
      const minutes = Math.round(task.duration / 60);
      console.log('TaskRow - Updating input value from task duration:', {
        taskId: task.id,
        minutes,
        duration: task.duration,
        isSelected
      });
      setInputValue(minutes.toString());
    }
  }, [task.duration, task.id, isSelected]);

  const preventPropagation = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
    console.log('Preventing event propagation');
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('TaskRow - Enter pressed:', {
        taskId: task.id,
        value: inputValue
      });
      handleBlur();
    }
    e.stopPropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('TaskRow - Handling duration change:', {
      taskId: task.id,
      value,
      isSelected
    });
    
    if (value === '' || /^\d+$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleBlur = () => {
    const numValue = parseInt(inputValue, 10);
    let finalValue = inputValue;
    
    if (isNaN(numValue) || numValue < 1) {
      finalValue = '25';
    } else if (numValue > 60) {
      finalValue = '60';
    }
    
    console.log('TaskRow - Handling blur:', {
      taskId: task.id,
      finalValue,
      isSelected
    });
    
    setInputValue(finalValue);
    
    // Convert minutes to seconds and update
    const newDurationInSeconds = (parseInt(finalValue) * 60).toString();
    console.log('TaskRow - Updating task duration:', {
      taskId: task.id,
      newDuration: newDurationInSeconds,
      isSelected
    });
    
    eventBus.emit('task:update', {
      taskId: task.id,
      updates: { duration: parseInt(newDurationInSeconds) }
    });
    onInputBlur();
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    eventBus.emit('task:delete', { taskId: task.id, reason: 'manual' });
  };

  const handleTaskClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if we clicked on a button or an input or any interactive element
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'BUTTON' || 
      target.closest('button') || 
      target.tagName === 'INPUT' || 
      target.closest('input') ||
      target.getAttribute('role') === 'button' ||
      target.getAttribute('data-action') === 'true'
    ) {
      console.log('Clicked on an interactive element inside TaskRow, not propagating');
      e.stopPropagation();
      return;
    }
    
    console.log('Clicked on TaskRow body, propagating to parent');
    onTaskClick(task, e);
  };

  return (
    <Card
      className={`
        relative cursor-pointer transition-all duration-300 group overflow-visible
        ${isSelected 
          ? 'bg-accent/20 border-primary/40 shadow-lg shadow-primary/5' 
          : 'bg-card/40 border-primary/10 hover:border-primary/30 hover:bg-accent/10 hover:shadow-md hover:scale-[1.01]'
        }
      `}
      onClick={handleTaskClick}
    >
      <TaskContent
        task={task}
        editingTaskId={editingTaskId}
        inputValue={inputValue}
        onDelete={handleDelete}
        onDurationClick={(e) => onDurationClick(e, task.id)}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        preventPropagation={preventPropagation}
      />
    </Card>
  );
};

export default TaskRow;
