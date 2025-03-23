
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
    
    // Ensure duration is always provided
    const duration = typeof task.duration === 'number' ? task.duration : 1500;
    
    // Emit timer:task-set event with the correct payload including taskId
    eventManager.emit('timer:task-set', { 
      id: task.id, 
      name: task.name,
      duration: duration, // Ensure duration is always provided
      taskId: task.id  // Always include the taskId property
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
