
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Task } from '@/types/tasks';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { eventManager } from '@/lib/events/EventManager';
import { v4 as uuidv4 } from 'uuid';

interface TaskSelectionContextValue {
  selectedTask: Task | null;
  timerKey: string;
  selectTask: (task: Task | null) => void;
  updateSelectedTask: (task: Task | null) => void;
}

const TaskSelectionContext = createContext<TaskSelectionContextValue | undefined>(undefined);

export const TaskSelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [timerKey, setTimerKey] = useState(uuidv4());
  const taskContext = useTaskContext();
  
  // Reset the timer when the selected task changes
  const resetTimer = useCallback(() => {
    setTimerKey(uuidv4());
  }, []);
  
  // Select a task and reset the timer
  const selectTask = useCallback((task: Task | null) => {
    console.log("TaskSelectionProvider: Selecting task", task?.id);
    setSelectedTask(task);
    resetTimer();
    
    // If a task was selected, also select it in the task context
    if (task && taskContext) {
      taskContext.selectTask(task.id);
      
      // Emit timer task set event
      const event = { taskId: task.id, task };
      eventManager.emit('timer:task-set', event);
      window.dispatchEvent(new CustomEvent('timer:set-task', { detail: event }));
    }
  }, [resetTimer, taskContext]);
  
  // Update the selected task without resetting the timer
  const updateSelectedTask = useCallback((task: Task | null) => {
    console.log("TaskSelectionProvider: Updating selected task", task?.id);
    setSelectedTask(task);
  }, []);
  
  // Listen for timer task selection events
  useEffect(() => {
    const handleTimerTaskSelect = (event: { taskId: string }) => {
      // If we have a task context, find the task and select it
      if (taskContext && event.taskId) {
        const task = taskContext.items.find(t => t.id === event.taskId);
        if (task) {
          console.log("TaskSelectionProvider: Selecting task from event", task.id);
          selectTask(task);
        }
      }
    };
    
    // Listen using eventManager
    eventManager.on('timer:select-task', handleTimerTaskSelect);
    
    return () => {
      eventManager.off('timer:select-task', handleTimerTaskSelect);
    };
  }, [taskContext, selectTask]);
  
  // Value to provide to consumers
  const value = {
    selectedTask,
    timerKey,
    selectTask,
    updateSelectedTask
  };
  
  return (
    <TaskSelectionContext.Provider value={value}>
      {children}
    </TaskSelectionContext.Provider>
  );
};

export const useTaskSelection = () => {
  const context = useContext(TaskSelectionContext);
  
  if (context === undefined) {
    throw new Error('useTaskSelection must be used within a TaskSelectionProvider');
  }
  
  return context;
};
