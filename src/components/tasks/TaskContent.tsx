
import { Task } from "@/types/tasks";
import { Sparkles, X, Clock } from "lucide-react";
import { TaskTags } from "./TaskTags";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";

interface TaskContentProps {
  task: Task;
  editingTaskId: string | null;
  inputValue: string;
  onDelete: (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void;
  onDurationClick: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  preventPropagation: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
}

export const TaskContent = ({
  task,
  editingTaskId,
  inputValue,
  onDelete,
  onDurationClick,
  onChange,
  onBlur,
  onKeyDown,
  preventPropagation,
}: TaskContentProps) => {
  const [localInputValue, setLocalInputValue] = useState(inputValue);
  
  useEffect(() => {
    if (editingTaskId === task.id) {
      setLocalInputValue(inputValue);
    }
  }, [inputValue, editingTaskId, task.id]);

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      console.log('Handling duration change:', value);
      setLocalInputValue(value);
      onChange(e);
    }
  };

  const handleLocalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed, handling blur');
      e.currentTarget.blur();
    }
    onKeyDown(e);
  };

  const handleLocalBlur = () => {
    let finalValue = localInputValue;
    if (finalValue === '' || isNaN(parseInt(finalValue, 10))) {
      finalValue = '25';
    } else {
      const numValue = parseInt(finalValue, 10);
      finalValue = Math.min(Math.max(numValue, 1), 60).toString();
    }
    
    console.log('Handling blur with final value:', finalValue);
    setLocalInputValue(finalValue);
    const syntheticEvent = {
      target: { value: finalValue }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    onBlur();
  };

  // Convert seconds to minutes for display
  const durationInMinutes = Math.round((task.duration || 1500) / 60);

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between w-full gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="rounded-full bg-primary/10 p-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <span className="text-foreground line-clamp-1 flex-1 font-medium">{task.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1 bg-primary/5 hover:bg-primary/10">
            <Clock className="h-3.5 w-3.5 text-primary opacity-70" />
            {editingTaskId === task.id ? (
              <Input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                value={localInputValue}
                className="w-12 text-right bg-transparent border-0 focus:ring-0 p-0 h-auto [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                onChange={handleLocalChange}
                onBlur={handleLocalBlur}
                onKeyDown={handleLocalKeyDown}
                autoFocus
                onClick={preventPropagation}
                onTouchStart={preventPropagation}
              />
            ) : (
              <span 
                className="w-8 text-right text-primary cursor-text"
                onClick={onDurationClick}
                onTouchStart={onDurationClick}
              >
                {durationInMinutes}
              </span>
            )}
            <span className="text-primary/70 text-sm">m</span>
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            onTouchStart={onDelete}
            className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors duration-200 touch-manipulation hover:bg-destructive/10"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {task.tags && (
        <TaskTags 
          tags={task.tags}
          preventPropagation={preventPropagation}
        />
      )}
    </div>
  );
};
