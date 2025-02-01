import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Trash2, Clock } from "lucide-react";
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
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDurationChange = useCallback((taskId: string, newDuration: string) => {
    // Find the task in the tasks array
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Parse the new duration, ensuring it's between 1 and 60
    const duration = Math.min(Math.max(parseInt(newDuration) || 25, 1), 60);
    
    // Get existing tasks from localStorage
    const existingTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
    
    // Update the task's duration
    const updatedTasks = existingTasks.map((t: Task) => 
      t.id === taskId ? { ...t, duration } : t
    );
    
    // Save back to localStorage
    localStorage.setItem('taskList', JSON.stringify(updatedTasks));
    
    // Update the tasks in the parent component through state management
    // This will trigger a re-render with the new duration
    const event = new CustomEvent('tasksUpdated', { 
      detail: { tasks: updatedTasks } 
    });
    window.dispatchEvent(event);
  }, [tasks]);

  return (
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60%]">Active Tasks</TableHead>
            <TableHead className="w-[20%] text-right">Duration (min)</TableHead>
            <TableHead className="w-[20%] text-right">
              {tasks.length > 0 && (
                <button
                  onClick={preventPropagation}
                  onTouchStart={(e) => {
                    preventPropagation(e);
                    onTasksClear();
                  }}
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors duration-200"
                >
                  Clear All
                </button>
              )}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              className={`cursor-pointer transition-colors duration-200
                ${selectedTasks.includes(task.id) 
                  ? 'bg-accent/10' 
                  : 'hover:bg-accent/5'
                }`}
              onClick={(e) => onTaskClick(task, e)}
            >
              <TableCell className="py-2">
                <span className="line-clamp-2">{task.name}</span>
              </TableCell>
              <TableCell className="py-2 text-right">
                <div 
                  className="flex items-center justify-end gap-2"
                  onClick={preventPropagation}
                  onTouchStart={preventPropagation}
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min={1}
                    max={60}
                    defaultValue={task.duration || 25}
                    className="w-16 text-right"
                    onChange={(e) => handleDurationChange(task.id, e.target.value)}
                    onClick={preventPropagation}
                    onTouchStart={preventPropagation}
                  />
                </div>
              </TableCell>
              <TableCell className="py-2 text-right">
                <button
                  onClick={preventPropagation}
                  onTouchStart={(e) => {
                    preventPropagation(e);
                    onTaskDelete(task.id);
                  }}
                  className="ml-2 text-muted-foreground hover:text-destructive transition-colors duration-200 touch-manipulation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};