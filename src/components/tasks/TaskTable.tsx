
import { useState, useCallback, useEffect } from "react";
import { Task } from "@/types/tasks";
import { TaskRow } from "./TaskRow";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface TaskTableProps {
  tasks: Task[];
  selectedTasks: string[];
  onTaskClick: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTasksUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTasksClear: () => void;
}

export const TaskTable = ({
  tasks,
  selectedTasks,
  onTaskClick,
  onTaskDelete,
  onTasksUpdate,
  onTasksClear,
}: TaskTableProps) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [displayedTasks, setDisplayedTasks] = useState<Task[]>([]);

  // Ensure we have the latest tasks
  useEffect(() => {
    console.log("TaskTable updating displayed tasks:", tasks);
    setDisplayedTasks(tasks);
  }, [tasks]);

  const handleDurationChange = useCallback((taskId: string, newDuration: string) => {
    const duration = parseInt(newDuration);
    if (isNaN(duration)) return;
    
    onTasksUpdate(taskId, { duration });
    setEditingTaskId(null);
  }, [onTasksUpdate]);

  const handleDurationClick = useCallback((e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>, taskId: string) => {
    e.stopPropagation();
    setEditingTaskId(taskId);
  }, []);

  const handleInputBlur = useCallback(() => {
    setEditingTaskId(null);
  }, []);

  const handleTaskDelete = useCallback((taskId: string) => {
    console.log("TaskTable: Deleting task", taskId);
    onTaskDelete(taskId);
  }, [onTaskDelete]);

  return (
    <div className="w-full space-y-2 p-4 overflow-visible">
      <div className="grid gap-2 w-full">
        {displayedTasks.length > 0 ? (
          displayedTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              isSelected={selectedTasks.includes(task.id)}
              editingTaskId={editingTaskId}
              onTaskClick={() => onTaskClick(task)}
              onTaskDelete={() => handleTaskDelete(task.id)}
              onDurationChange={handleDurationChange}
              onDurationClick={handleDurationClick}
              onInputBlur={handleInputBlur}
            />
          ))
        ) : (
          <div className="text-center text-muted-foreground py-4">No tasks available</div>
        )}
      </div>
      
      {displayedTasks.length > 1 && (
        <div className="flex justify-center pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onTasksClear}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash className="h-4 w-4 mr-2" />
            Clear All Tasks
          </Button>
        </div>
      )}
    </div>
  );
};
