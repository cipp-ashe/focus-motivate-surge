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
import { MinutesInput } from "./MinutesInput";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [editingDuration, setEditingDuration] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleDurationClick = useCallback((e: React.MouseEvent | React.TouchEvent, taskId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingDuration(taskId);
  }, []);

  const handleDurationChange = useCallback((taskId: string, minutes: number) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      const updatedTask = { ...tasks[taskIndex], duration: minutes };
      tasks[taskIndex] = updatedTask;
      console.log(`Updated task ${taskId} duration to ${minutes} minutes`);
    }
  }, [tasks]);

  const handleDurationBlur = useCallback(() => {
    if (isMobile) {
      setTimeout(() => {
        setEditingDuration(null);
      }, 300);
    } else {
      setEditingDuration(null);
    }
  }, [isMobile]);

  const preventPropagation = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

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
                  className="flex items-center justify-end gap-2 touch-manipulation"
                  onClick={(e) => handleDurationClick(e, task.id)}
                  onTouchStart={(e) => {
                    preventPropagation(e);
                    handleDurationClick(e, task.id);
                  }}
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {editingDuration === task.id ? (
                    <div 
                      onClick={preventPropagation}
                      onTouchStart={preventPropagation}
                      onTouchEnd={preventPropagation}
                      onTouchMove={preventPropagation}
                      className="w-32 touch-manipulation"
                    >
                      <MinutesInput
                        minutes={task.duration || 0}
                        onMinutesChange={(minutes) => handleDurationChange(task.id, minutes)}
                        minMinutes={1}
                        maxMinutes={60}
                        onBlur={handleDurationBlur}
                      />
                    </div>
                  ) : (
                    <span 
                      className="text-muted-foreground hover:text-foreground transition-colors min-h-[24px] min-w-[24px] flex items-center justify-end touch-manipulation"
                    >
                      {task.duration || '–'}
                    </span>
                  )}
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