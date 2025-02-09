
import { createContext, useContext, ReactNode } from 'react';
import { Task, TaskContextType } from '@/types/tasks';

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
  initialTasks?: Task[];
  initialCompletedTasks?: Task[];
  onTasksUpdate?: (tasks: Task[]) => void;
  onCompletedTasksUpdate?: (tasks: Task[]) => void;
}

export const TaskProvider = ({
  children,
  initialTasks = [],
  initialCompletedTasks = [],
  onTasksUpdate,
  onCompletedTasksUpdate,
}: TaskProviderProps) => {
  const taskManager = useTaskManager({
    initialTasks,
    initialCompletedTasks,
    onTasksUpdate,
    onCompletedTasksUpdate,
  });

  return (
    <TaskContext.Provider value={taskManager}>
      {children}
    </TaskContext.Provider>
  );
};
