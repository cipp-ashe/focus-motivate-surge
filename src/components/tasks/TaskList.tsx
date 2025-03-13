
import React from 'react';
import { Task } from '@/types/tasks';
import { TaskContent } from './TaskContent';
import { eventBus } from '@/lib/eventBus';

interface TaskListProps {
  tasks: Task[];
  selectedTaskId: string | null;
  dialogOpeners?: {
    checklist: (taskId: string, taskName: string, items: any[]) => void;
    journal: (taskId: string, taskName: string, entry: string) => void;
    screenshot: (imageUrl: string, taskName: string) => void;
    voicenote: (taskId: string, taskName: string) => void;
  };
}

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  selectedTaskId,
  dialogOpeners
}) => {
  const handleTaskSelect = (taskId: string) => {
    eventBus.emit('task:select', taskId);
  };

  return (
    <div className="space-y-2">
      {tasks.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground border border-dashed rounded-lg">
          No tasks found
        </div>
      ) : (
        tasks.map((task) => (
          <TaskContent
            key={task.id}
            task={task}
            isSelected={task.id === selectedTaskId}
            onSelect={() => handleTaskSelect(task.id)}
            dialogOpeners={dialogOpeners}
          />
        ))
      )}
    </div>
  );
};
