
import React from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { TaskInput } from './TaskInput';
import { TaskTable } from './TaskTable';
import { CompletedTasks } from './CompletedTasks';
import { HabitTaskManager } from '../habits/HabitTaskManager';
import { useTaskContext } from '@/contexts/TaskContext';
import { ListTodo, Award, TimerOff } from 'lucide-react';

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

      <div className="flex-none px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2 text-foreground">
          <ListTodo className="h-4 w-4 text-primary" />
          <span className="font-medium">Active Tasks</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tasks.length > 0 ? (
          <TaskTable
            tasks={tasks}
            selectedTasks={selectedTasks}
            onTaskClick={onTaskClick}
            onTaskDelete={(taskId) => eventBus.emit('task:delete', { taskId, reason: 'manual' })}
            onTasksUpdate={onTasksUpdate}
            onTasksClear={() => tasks.forEach(task => eventBus.emit('task:delete', { taskId: task.id, reason: 'manual' }))}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4 text-muted-foreground space-y-2">
            <ListTodo className="h-8 w-8 text-muted-foreground/50" />
            <p>No active tasks</p>
            <p className="text-sm">Add a new task to get started</p>
          </div>
        )}
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
