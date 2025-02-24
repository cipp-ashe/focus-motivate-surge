
import React from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { TaskInput } from './TaskInput';
import { TaskTable } from './TaskTable';
import { CompletedTasks } from './CompletedTasks';
import { HabitTaskManager } from '../habits/HabitTaskManager';
import { useTaskContext } from '@/contexts/TaskContext';

interface TaskListProps {
  tasks: Task[];
  selectedTasks: string[];
  onTaskClick: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTasksUpdate: (taskId: string, updates: any) => void;
  onTasksClear: () => void;
  onCompletedTasksClear: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  selectedTasks,
  onTaskClick,
  onTaskDelete,
  onTasksUpdate,
  onTasksClear,
  onCompletedTasksClear,
}) => {
  const { completed: completedTasks } = useTaskContext();

  const handleTaskAdd = (task: Task) => {
    eventBus.emit('task:create', task);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none border-b border-border/50">
        <TaskInput onTaskAdd={handleTaskAdd} />
      </div>
      
      <HabitTaskManager />

      <div className="flex-1 overflow-y-auto">
        <TaskTable
          tasks={tasks}
          selectedTasks={selectedTasks}
          onTaskClick={onTaskClick}
          onTaskDelete={(taskId) => eventBus.emit('task:delete', { taskId, reason: 'manual' })}
          onTasksUpdate={onTasksUpdate}
          onTasksClear={() => tasks.forEach(task => eventBus.emit('task:delete', { taskId: task.id, reason: 'manual' }))}
        />
      </div>

      {completedTasks.length > 0 && (
        <div className="flex-none border-t border-border/50">
          <CompletedTasks 
            tasks={completedTasks}
            onTasksClear={() => completedTasks.forEach(task => 
              eventBus.emit('task:delete', { taskId: task.id, reason: 'completed' })
            )}
          />
        </div>
      )}
    </div>
  );
};
