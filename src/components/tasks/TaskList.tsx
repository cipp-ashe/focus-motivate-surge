
import React from 'react';
import { TaskInput } from './TaskInput';
import { TaskTable } from './TaskTable';
import { CompletedTasks } from './CompletedTasks';
import { useTaskState, useTaskActions } from '@/contexts/tasks/TaskContext';
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
  const { completed: completedTasks } = useTaskState();
  const actions = useTaskActions();
  const { activeTemplates } = useTemplateManagement();

  return (
    <div className="section-container">
      <div className="flex-none p-1">
        <TaskInput onTaskAdd={(task) => actions.addTask(task)} />
      </div>
      
      <HabitTaskManager 
        activeTemplates={activeTemplates}
      />

      <div className="scrollable-content">
        <TaskTable
          tasks={tasks}
          selectedTasks={selectedTasks}
          onTaskClick={onTaskClick}
          onTaskDelete={onTaskDelete}
          onTasksUpdate={onTasksUpdate}
          onTasksClear={onTasksClear}
        />
      </div>

      <div className="flex-none">
        <CompletedTasks 
          tasks={completedTasks}
          onTasksClear={() => {
            completedTasks.forEach(task => actions.deleteTask(task.id));
          }}
        />
      </div>
    </div>
  );
};
