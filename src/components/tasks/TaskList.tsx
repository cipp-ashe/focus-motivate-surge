
import React from 'react';
import { TaskInput } from './TaskInput';
import { TaskTable } from './TaskTable';
import { CompletedTasks } from './CompletedTasks';
import { useAppState, useAppStateActions } from '@/contexts/AppStateContext';
import { HabitTaskManager } from '../habits/HabitTaskManager';
import { useTemplateManagement } from '@/components/habits/hooks/useTemplateManagement';
import type { Task } from '@/types/tasks';

export const TaskList = ({
  tasks,
  selectedTasks,
  onTaskClick,
  onTaskDelete,
  onTasksUpdate,
  onTasksClear,
}: {
  tasks: Task[];
  selectedTasks: string[];
  onTaskClick: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTasksUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTasksClear: () => void;
}) => {
  const { tasks: { completed: completedTasks } } = useAppState();
  const actions = useAppStateActions();
  const { activeTemplates } = useTemplateManagement();

  return (
    <div className="space-y-4 h-full overflow-y-auto px-1">
      <TaskInput onTaskAdd={(task) => actions.addTask(task)} />
      
      <HabitTaskManager 
        activeTemplates={activeTemplates}
      />

      <TaskTable
        tasks={tasks}
        selectedTasks={selectedTasks}
        onTaskClick={onTaskClick}
        onTaskDelete={onTaskDelete}
        onTasksUpdate={onTasksUpdate}
        onTasksClear={onTasksClear}
      />

      <CompletedTasks 
        tasks={completedTasks}
        onTasksClear={() => {
          completedTasks.forEach(task => actions.deleteTask(task.id));
        }}
      />
    </div>
  );
};
