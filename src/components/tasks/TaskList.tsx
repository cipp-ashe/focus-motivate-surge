
import React from 'react';
import { TaskInput } from './TaskInput';
import { TaskTable } from './TaskTable';
import { CompletedTasks } from './CompletedTasks';
import { useTaskState } from '@/contexts/tasks/TaskContext';
import { HabitTaskManager } from '../habits/HabitTaskManager';
import { useTemplateManagement } from '@/components/habits/hooks/useTemplateManagement';
import { eventBus } from '@/lib/eventBus';
import type { Task } from '@/types/tasks';

export const TaskList = ({
  tasks,
  selectedTasks,
  onTaskClick,
  onTaskDelete,
  onTasksUpdate,
  onTasksClear,
  onCompletedTasksClear,
}: {
  tasks: Task[];
  selectedTasks: string[];
  onTaskClick: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTasksUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTasksClear: () => void;
  onCompletedTasksClear: () => void;
}) => {
  const { completed: completedTasks } = useTaskState();
  const { activeTemplates } = useTemplateManagement();

  const handleTaskAdd = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    eventBus.emit('task:create', task);
  };

  return (
    <>
      <div className="section-header">
        <TaskInput onTaskAdd={handleTaskAdd} />
      </div>
      
      <div className="section-header">
        <HabitTaskManager 
          activeTemplates={activeTemplates}
        />
      </div>

      <div className="scrollable-content">
        <TaskTable
          tasks={tasks}
          selectedTasks={selectedTasks}
          onTaskClick={onTaskClick}
          onTaskDelete={(taskId) => eventBus.emit('task:delete', taskId)}
          onTasksUpdate={onTasksUpdate}
          onTasksClear={() => tasks.forEach(task => eventBus.emit('task:delete', task.id))}
        />
      </div>

      <div className="section-footer">
        <CompletedTasks 
          tasks={completedTasks}
          onTasksClear={() => completedTasks.forEach(task => eventBus.emit('task:delete', task.id))}
        />
      </div>
    </>
  );
};
