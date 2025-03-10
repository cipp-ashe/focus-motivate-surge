
import React, { useState, useCallback, useEffect } from "react";
import { Task } from "@/types/tasks";
import { TaskRow } from "./TaskRow";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { eventBus } from "@/lib/eventBus";

interface TaskTableProps {
  tasks: Task[];
  selectedTasks: string[];
}

export const TaskTable = ({
  tasks,
  selectedTasks,
}: TaskTableProps) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  
  // Log tasks whenever they change
  useEffect(() => {
    console.log("TaskTable received tasks:", tasks.length, "tasks:", tasks);
  }, [tasks]);

  const handleTaskClick = useCallback((task: Task) => {
    console.log("TaskTable: Task clicked", task.id);
    eventBus.emit('task:select', task.id);
    
    // Also emit timer start event with task info
    eventBus.emit('timer:start', { 
      taskName: task.name, 
      duration: task.duration || 1500 
    });
  }, []);

  const handleDurationChange = useCallback((taskId: string, newDuration: string) => {
    const duration = parseInt(newDuration);
    if (isNaN(duration)) return;
    
    // Use event bus directly for update
    eventBus.emit('task:update', { taskId, updates: { duration } });
    setEditingTaskId(null);
  }, []);

  const handleDurationClick = useCallback((e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>, taskId: string) => {
    e.stopPropagation();
    setEditingTaskId(taskId);
  }, []);

  const handleInputBlur = useCallback(() => {
    setEditingTaskId(null);
  }, []);

  const handleTaskDelete = useCallback((taskId: string) => {
    console.log("TaskTable: Deleting task", taskId);
    // Use event bus directly for deletion
    eventBus.emit('task:delete', { taskId, reason: 'manual' });
  }, []);

  const handleClearAllTasks = useCallback(() => {
    console.log("TaskTable: Clearing all tasks");
    // Clear tasks one by one using the event bus
    tasks.forEach(task => {
      eventBus.emit('task:delete', { taskId: task.id, reason: 'manual' });
    });
  }, [tasks]);

  return (
    <div className="w-full space-y-2 p-4 overflow-visible">
      <div className="grid gap-2 w-full max-h-[70vh] overflow-y-auto pr-1">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              isSelected={selectedTasks.includes(task.id)}
              editingTaskId={editingTaskId}
              onTaskClick={() => handleTaskClick(task)}
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
      
      {tasks.length > 1 && (
        <div className="flex justify-center pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAllTasks}
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
