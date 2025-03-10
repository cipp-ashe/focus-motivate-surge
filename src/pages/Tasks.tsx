
import React from 'react';
import TaskManager from '@/components/tasks/TaskManager';

const TaskPage = () => {
  return (
    <div className="container mx-auto py-4 px-4">
      <h1 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
        Task Manager
      </h1>
      <TaskManager />
    </div>
  );
};

export default TaskPage;
