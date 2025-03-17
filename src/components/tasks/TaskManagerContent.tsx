
import React, { useState, useCallback } from 'react';
import { Task } from '@/types/tasks';
import { TaskItem } from './components/TaskItem';
import { useTaskContext } from '@/contexts/tasks/TaskContext';

export interface TaskManagerContentProps {
  tasks: Task[];
  completedTasks: Task[];
  selectedTaskId: string | null;
  isTimerView?: boolean;
  dialogOpeners?: {
    checklist: (taskId: string, taskName: string, items: any[]) => void;
    journal: (taskId: string, taskName: string, entry: string) => void;
    screenshot: (imageUrl: string, taskName: string) => void;
    voicenote: (taskId: string, taskName: string) => void;
  };
  onTaskAdd: (task: Task) => void;
  onTasksAdd: (tasks: Task[]) => void;
}

export const TaskManagerContent: React.FC<TaskManagerContentProps> = ({
  tasks,
  completedTasks,
  selectedTaskId,
  isTimerView = false,
  dialogOpeners,
  onTaskAdd,
  onTasksAdd
}) => {
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  
  const handleOpenTask = useCallback((taskId: string) => {
    setOpenTaskId(taskId === openTaskId ? null : taskId);
  }, [openTaskId]);
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center p-4 border rounded-md bg-background text-muted-foreground">
            No tasks available. Create a new task to get started.
          </div>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onOpenTaskDialog={() => handleOpenTask(task.id)}
              isTimerView={isTimerView}
              dialogOpeners={dialogOpeners}
            />
          ))
        )}
      </div>
      
      {completedTasks.length > 0 && (
        <div className="mt-8">
          <h2 className="font-medium text-lg mb-2">Completed Tasks</h2>
          <div className="space-y-2">
            {completedTasks.slice(0, 5).map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onOpenTaskDialog={() => handleOpenTask(task.id)}
                isTimerView={false}
                dialogOpeners={dialogOpeners}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
