
import { Task } from "@/types/tasks";
import { useState, useEffect } from "react";
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

  // Update local state when task duration changes
  useEffect(() => {
    if (task.duration) {
      setInputValue(Math.round(Number(task.duration) / 60).toString());
    }
  }, [task.duration]);

  const preventPropagation = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
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
    let finalValue = '25';
    
    if (inputValue !== '') {
      const numValue = parseInt(inputValue, 10);
      if (!isNaN(numValue)) {
        finalValue = Math.min(Math.max(numValue, 1), 60).toString();
      }
    }
    
    setInputValue(finalValue);
    const newDurationInSeconds = (parseInt(finalValue) * 60).toString();
    onDurationChange(task.id, newDurationInSeconds);
    
    // Trigger a re-selection of the task to update the timer if this task is selected
    if (isSelected) {
      onTaskClick(task, new MouseEvent('click') as any);
    }
    
    onInputBlur();
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onTaskDelete(task.id);
  };

  return (
    <div
      className={`
        relative flex flex-col gap-2
        p-4 rounded-lg border border-primary/20 bg-card/50 backdrop-blur-sm
        cursor-pointer transition-all duration-200 group
        ${isSelected 
          ? 'bg-accent/10 border-primary/40' 
          : 'hover:border-primary/30 hover:bg-accent/5'
        }
      `}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => onTaskClick(task, e)}
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
    </div>
  );
};

export default TaskRow;
