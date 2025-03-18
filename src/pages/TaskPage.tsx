
import React, { useState } from 'react';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskInput } from '@/components/tasks/TaskInput';
import { ErrorBoundary } from 'react-error-boundary';
import { TaskProvider, useTaskState, useTaskActions } from '@/contexts/tasks/TaskContext';
import { Task } from '@/types/tasks';

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-md">
    <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Tasks</h2>
    <p className="mb-2">There was a problem loading the tasks component.</p>
    <details className="text-sm text-gray-700 dark:text-gray-300">
      <summary>Technical Details</summary>
      <p className="mt-1">{error.message}</p>
    </details>
  </div>
);

const TaskContent = () => {
  const { tasks, selectedTaskId } = useTaskState();
  const { addTask, addTasks } = useTaskActions();
  
  // Dialog openers for task actions
  const dialogOpeners = {
    checklist: (taskId: string, taskName: string, items: any[]) => {
      console.log("Open checklist for", taskId, taskName, items);
    },
    journal: (taskId: string, taskName: string, entry: string) => {
      console.log("Open journal for", taskId, taskName, entry);
    },
    screenshot: (imageUrl: string, taskName: string) => {
      console.log("Open screenshot", imageUrl, taskName);
    },
    voicenote: (taskId: string, taskName: string) => {
      console.log("Open voice note for", taskId, taskName);
    }
  };

  return (
    <TaskLayout
      asideContent={
        <TaskInput 
          onTaskAdd={addTask} 
          onTasksAdd={addTasks} 
        />
      }
      mainContent={
        <TaskList 
          tasks={tasks} 
          selectedTaskId={selectedTaskId} 
          dialogOpeners={dialogOpeners}
        />
      }
    />
  );
};

const TaskPage = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <TaskProvider>
        <TaskContent />
      </TaskProvider>
    </ErrorBoundary>
  );
};

export default TaskPage;
