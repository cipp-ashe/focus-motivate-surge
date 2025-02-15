
import React, { createContext, useContext } from 'react';
import { useTaskStorage } from '@/hooks/useTaskStorage';
import type { TaskContextType } from '@/types/tasks';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const taskStorage = useTaskStorage();
  
  return (
    <TaskContext.Provider value={taskStorage}>
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
