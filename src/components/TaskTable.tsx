import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Trash2, Clock, Sparkles, X } from "lucide-react";
import { Task } from "./TaskList";
import { useState, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "./ui/input";

interface TaskTableProps {
  tasks: Task[];
  selectedTasks: string[];
  onTaskClick: (task: Task, event: React.MouseEvent) => void;
  onTaskDelete: (taskId: string) => void;
  onTasksClear: () => void;
}

export const TaskTable = ({
  tasks,
  selectedTasks,
  onTaskClick,
  onTaskDelete,
  onTasksClear,
}: TaskTableProps) => {
  const isMobile = useIsMobile();

  const preventPropagation = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  }, []);

  const handleClearAll = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    preventPropagation(e);
    onTasksClear();
  }, [onTasksClear, preventPropagation]);

  const handleDurationChange = useCallback((taskId: string, newDuration: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const duration = Math.min(Math.max(parseInt(newDuration) || 25, 1), 60);
    const updatedTask = { ...task, duration };
    onTaskClick(updatedTask, new MouseEvent('click') as unknown as React.MouseEvent);
  }, [tasks, onTaskClick]);

  const handleTaskDelete = useCallback((e: React.MouseEvent | React.TouchEvent, taskId: string) => {
    preventPropagation(e);
    onTaskDelete(taskId);
  }, [onTaskDelete, preventPropagation]);

  return (
    <div className="mt-4 space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`
            relative flex items-center justify-between
            p-4 rounded-lg border border-primary/20 bg-card/50 backdrop-blur-sm
            cursor-pointer transition-all duration-200
            ${selectedTasks.includes(task.id) 
              ? 'bg-accent/10 border-primary/40' 
              : 'hover:border-primary/30 hover:bg-accent/5'
            }
          `}
          onClick={(e) => onTaskClick(task, e)}
        >
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-foreground line-clamp-1">{task.name}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div 
              className="flex items-center gap-2"
              onClick={preventPropagation}
              onTouchStart={preventPropagation}
            >
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                min={1}
                max={60}
                value={task.duration || 25}
                className="w-16 text-right bg-transparent"
                onChange={(e) => handleDurationChange(task.id, e.target.value)}
                onClick={preventPropagation}
                onTouchStart={preventPropagation}
              />
              <span className="text-muted-foreground">m</span>
            </div>
            
            <button
              onClick={(e) => handleTaskDelete(e, task.id)}
              onTouchStart={(e) => handleTaskDelete(e, task.id)}
              className="text-muted-foreground hover:text-destructive transition-colors duration-200 touch-manipulation"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      
      {tasks.length > 0 && (
        <button
          onClick={handleClearAll}
          onTouchStart={handleClearAll}
          className="text-sm text-muted-foreground hover:text-destructive transition-colors duration-200 mt-2"
        >
          Clear All
        </button>
      )}
    </div>
  );
};