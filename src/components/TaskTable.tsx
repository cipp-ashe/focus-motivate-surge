import { useState, useCallback } from "react";
import { Task } from "./TaskList";
import { TaskRow } from "./tasks/TaskRow";

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
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleDurationChange = useCallback((taskId: string, newDuration: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const duration = Math.min(Math.max(parseInt(newDuration) || 25, 1), 60);
    const updatedTask = { ...task, duration };
    onTaskClick(updatedTask, new MouseEvent('click') as unknown as React.MouseEvent);
    setEditingTaskId(null);
  }, [tasks, onTaskClick]);

  const handleDurationClick = useCallback((e: React.MouseEvent | React.TouchEvent, taskId: string) => {
    e.stopPropagation();
    setEditingTaskId(taskId);
  }, []);

  const handleInputBlur = useCallback(() => {
    setEditingTaskId(null);
  }, []);

  return (
    <div className="mt-4 space-y-2">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          isSelected={selectedTasks.includes(task.id)}
          editingTaskId={editingTaskId}
          onTaskClick={onTaskClick}
          onTaskDelete={onTaskDelete}
          onDurationChange={handleDurationChange}
          onDurationClick={handleDurationClick}
          onInputBlur={handleInputBlur}
        />
      ))}
      
      {tasks.length > 0 && (
        <button
          onClick={onTasksClear}
          onTouchStart={onTasksClear}
          className="text-sm text-muted-foreground hover:text-destructive transition-colors duration-200 mt-2"
        >
          Clear All
        </button>
      )}
    </div>
  );
};