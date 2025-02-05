import React, { createContext, useContext } from 'react';
import { useTaskManager } from './useTaskManager';

interface Task {
  title: string;
  completed: boolean;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  toggleTask: (index: number) => void;
  removeTask: (index: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const taskManager = useTaskManager();

  return (
    <TaskContext.Provider value={taskManager}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
