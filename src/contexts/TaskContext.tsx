
import React, { createContext, useContext } from 'react';
import { useTaskStorage } from '@/hooks/useTaskStorage';
import type { TaskState } from '@/types/tasks';

const TaskContext = createContext<TaskState | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const taskState = useTaskStorage();
  
  return (
    <TaskContext.Provider value={taskState}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
