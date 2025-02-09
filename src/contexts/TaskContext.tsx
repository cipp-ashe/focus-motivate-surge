
import { createContext, useContext, ReactNode } from 'react';
import { Task, TaskContextType } from '@/types/tasks';
import { useTaskStorage } from '@/hooks/useTaskStorage';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const taskManager = useTaskStorage();

  return (
    <TaskContext.Provider value={taskManager}>
      {children}
    </TaskContext.Provider>
  );
};
