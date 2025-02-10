
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
    
    onDurationChange(task.id, newDurationInSeconds);
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
