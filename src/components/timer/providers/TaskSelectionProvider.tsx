
import React, { useState, useContext, createContext, useCallback, ReactNode } from 'react';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';

interface TaskSelectionContextType {
  selectedTask: Task | null;
  selectTask: (task: Task) => void;
  clearSelectedTask: () => void;
}

const TaskSelectionContext = createContext<TaskSelectionContextType | undefined>(undefined);

export const useTaskSelection = () => {
  const context = useContext(TaskSelectionContext);
  if (!context) {
    throw new Error('useTaskSelection must be used within a TaskSelectionProvider');
  }
  return context;
};

interface TaskSelectionProviderProps {
  children: ReactNode;
}

export const TaskSelectionProvider: React.FC<TaskSelectionProviderProps> = ({ children }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Select a task for the timer
  const selectTask = useCallback((task: Task) => {
    console.log('TaskSelectionProvider: Selecting task', task.id, task.name);
    setSelectedTask(task);
    
    // Emit task selection event with proper types
    eventManager.emit('timer:task-set', { 
      id: task.id, 
      name: task.name,
      duration: task.duration || 1500, // Default to 25 minutes if no duration
      taskId: task.id
    });
    
    // Also emit the more general select event
    eventManager.emit('task:select', task.id);
  }, []);

  // Clear the selected task
  const clearSelectedTask = useCallback(() => {
    console.log('TaskSelectionProvider: Clearing selected task');
    setSelectedTask(null);
  }, []);

  const value = {
    selectedTask,
    selectTask,
    clearSelectedTask
  };

  return (
    <TaskSelectionContext.Provider value={value}>
      {children}
    </TaskSelectionContext.Provider>
  );
};
