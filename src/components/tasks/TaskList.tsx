
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

  const handleTaskDelete = (taskId: string) => {
    eventBus.emit('task:delete', { taskId, reason: 'manual' });
  };

  const handleTasksClear = () => {
    tasks.forEach(task => {
      eventBus.emit('task:delete', { taskId: task.id, reason: 'manual' });
    });
  };

  return (
    <>
      <div className="section-header">
        <TaskInput onTaskAdd={handleTaskAdd} />
      </div>
      
      <div className="section-header">
        <HabitTaskManager 
          activeTemplates={[]} // This should be passed from a parent component
        />
      </div>

      <div className="scrollable-content">
        <TaskTable
          tasks={tasks}
          selectedTasks={selectedTasks}
          onTaskClick={onTaskClick}
          onTaskDelete={(taskId) => eventBus.emit('task:delete', { taskId, reason: 'manual' })}
          onTasksUpdate={onTasksUpdate}
          onTasksClear={() => tasks.forEach(task => eventBus.emit('task:delete', { taskId: task.id, reason: 'manual' }))}
        />
      </div>

      <div className="section-footer">
        <CompletedTasks 
          tasks={completedTasks}
          onTasksClear={() => completedTasks.forEach(task => 
            eventBus.emit('task:delete', { taskId: task.id, reason: 'completed' })
          )}
        />
      </div>
    </>
  );
};
