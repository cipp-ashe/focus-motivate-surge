
import React from 'react';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskInput } from '@/components/tasks/TaskInput';
import { ErrorBoundary } from 'react-error-boundary';
import { TaskProvider } from '@/contexts/tasks/TaskContext';

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
  return (
    <TaskLayout
      asideContent={<TaskInput />}
      mainContent={<TaskList />}
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
