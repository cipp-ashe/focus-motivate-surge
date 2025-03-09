
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { taskReducer } from './taskReducer';
import { taskState } from './taskState';
import { useTaskEvents } from './useTaskEvents';
import { useTaskPersistence } from './useTaskPersistence';
import { useTaskNavigation } from './useTaskNavigation';
import { TaskContextState } from './types';

const TaskContext = createContext<TaskContextState | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with data from localStorage
  const [state, dispatch] = useReducer(taskReducer, taskState.getInitialState());
  
  // Set up event handling
  const { forceTasksReload } = useTaskEvents(state.items, state.completed, dispatch);
  
  // Set up persistence
  useTaskPersistence(state.items, state.completed);
  
  // Set up navigation handling
  useTaskNavigation(forceTasksReload);
  
  // Load initial data
  useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        const result = taskState.loadFromStorage();
        dispatch({ type: 'LOAD_TASKS', payload: result });
        
        // Force task update after initial load with staggered timing
        // to ensure all components have properly mounted
        setTimeout(() => {
          window.dispatchEvent(new Event('force-task-update'));
          
          // Check for pending habits
          setTimeout(() => {
            console.log("TaskContext: Initial load complete, checking for pending habits");
            window.dispatchEvent(new Event('force-task-update'));
          }, 250);
        }, 100);
        
        return result;
      } catch (error) {
        console.error('Error in initial task loading:', error);
        toast.error('Failed to load tasks');
        return { tasks: [], completed: [] };
      }
    }
  });

  // Progressive verification system to ensure data integrity
  useEffect(() => {
    if (!state.isLoaded) return;
    
    const verificationTimeout = setTimeout(() => {
      const missingTasks = taskState.verifyConsistency(state.items);
      
      if (missingTasks.length > 0) {
        console.log(`TaskContext: Verification found ${missingTasks.length} missing tasks, adding to state`);
        missingTasks.forEach(task => {
          dispatch({ type: 'ADD_TASK', payload: task });
        });
      } else {
        console.log("TaskContext: Verification complete, all tasks are in sync");
      }
    }, 500);
    
    return () => clearTimeout(verificationTimeout);
  }, [state.isLoaded, state.items]);

  return (
    <TaskContext.Provider value={state}>
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
