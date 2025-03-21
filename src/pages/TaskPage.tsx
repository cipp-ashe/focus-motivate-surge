
import React, { useState } from 'react';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskInput } from '@/components/tasks/TaskInput';
import { ErrorBoundary } from 'react-error-boundary';
import { TaskProvider, useTaskContext } from '@/contexts/tasks/TaskContext';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';

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
  const { items: tasks, selected: selectedTaskId, addTask } = useTaskContext();
  
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

  // Event handlers for TaskList
  const handleTaskSelect = (taskId: string) => {
    eventBus.emit('task:select', taskId);
  };

  const handleTaskDelete = (data: { taskId: string }) => {
    eventBus.emit('task:delete', data);
  };

  const handleTaskUpdate = (data: { taskId: string; updates: Partial<Task> }) => {
    eventBus.emit('task:update', data);
  };

  const handleTaskComplete = (data: { taskId: string; metrics?: any }) => {
    eventBus.emit('task:complete', data);
  };

  // Function to handle adding multiple tasks
  const addTasks = (newTasks: Task[]) => {
    if (newTasks && newTasks.length > 0 && addTask) {
      newTasks.forEach(task => addTask(task));
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
          handleTaskSelect={handleTaskSelect}
          handleDelete={handleTaskDelete}
          handleTaskUpdate={handleTaskUpdate}
          handleTaskComplete={handleTaskComplete}
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
