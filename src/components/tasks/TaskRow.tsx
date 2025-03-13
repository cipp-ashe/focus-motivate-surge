
import { Task } from "@/types/tasks";
import { useState, useEffect } from "react";
import { eventBus } from "@/lib/eventBus";
import { Card } from "@/components/ui/card";
import { TaskContent } from "./TaskContent";

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
      setInputValue(minutes.toString());
    }
  }, [task.duration, task.id]);

  const preventPropagation = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
    e.stopPropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
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
    
    setInputValue(finalValue);
    
    // Convert minutes to seconds and update
    const newDurationInSeconds = (parseInt(finalValue) * 60).toString();
    
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
    // More robust check for interactive elements to prevent task selection when clicking on buttons
    const target = e.target as HTMLElement;
    const isInteractive = 
      target.tagName === 'BUTTON' || 
      target.closest('button') || 
      target.tagName === 'INPUT' || 
      target.closest('input') ||
      target.getAttribute('role') === 'button' ||
      target.getAttribute('data-action') === 'true' ||
      target.closest('[data-action="true"]');
    
    if (isInteractive) {
      e.stopPropagation();
      return;
    }
    
    // Special handling for journal and checklist tasks to prevent conversion to timer
    if ((task.taskType === 'journal' || task.taskType === 'checklist') && !isSelected) {
      e.stopPropagation();
      
      // Select the task without triggering conversion
      eventBus.emit('task:select', task.id);
      return;
    }
    
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
