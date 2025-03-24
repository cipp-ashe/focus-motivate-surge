
import React, { useState, useEffect } from 'react';
import { Task } from '@/types/tasks';
import { ScrollArea } from '@/components/ui/scroll-area';
import TaskRow from './TaskRow';
import { eventManager } from '@/lib/events/EventManager';

interface TaskTableProps {
  tasks: Task[];
  selectedTasks: string[];
  dialogOpeners?: {
    checklist: (taskId: string, taskName: string, items: any[]) => void;
    journal: (taskId: string, taskName: string, entry: string) => void;
    screenshot: (imageUrl: string, taskName: string) => void;
    voicenote: (taskId: string, taskName: string) => void;
  };
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  selectedTasks,
  dialogOpeners,
}) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  
  // Debug: Log tasks whenever they change
  useEffect(() => {
    console.log("TaskTable received tasks:", tasks.length, "tasks:", tasks);
    console.log("TaskTable has dialogOpeners:", !!dialogOpeners);
  }, [tasks, dialogOpeners]);
  
  // Handle input blur to exit editing mode
  const handleInputBlur = () => {
    setEditingTaskId(null);
  };

  // Handle task selection
  const handleTaskClick = (task: Task, event: React.MouseEvent<HTMLDivElement>) => {
    eventManager.emit('task:select', task.id);
  };

  // Handle task deletion
  const handleTaskDelete = (taskId: string) => {
    eventManager.emit('task:delete', { taskId, reason: 'manual' });
  };

  // Handle task duration change
  const handleDurationChange = (taskId: string, newDuration: string) => {
    eventManager.emit('task:update', {
      taskId,
      updates: { duration: parseInt(newDuration) * 60 }
    });
  };

  // Handle duration clicks for editing
  const handleDurationClick = (
    e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
    taskId: string
  ) => {
    e.stopPropagation();
    setEditingTaskId(taskId);
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-muted-foreground mb-2">No tasks available</p>
        <p className="text-sm text-muted-foreground/70">
          Create a task using the input field above
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full">
      <div className="p-2 space-y-2 min-w-[300px] max-w-full">
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            isSelected={selectedTasks.includes(task.id)}
            editingTaskId={editingTaskId}
            onTaskClick={handleTaskClick}
            onTaskDelete={handleTaskDelete}
            onDurationChange={handleDurationChange}
            onDurationClick={handleDurationClick}
            onInputBlur={handleInputBlur}
            dialogOpeners={dialogOpeners}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default TaskTable;
