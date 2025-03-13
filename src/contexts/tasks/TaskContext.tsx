
import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { taskReducer } from './taskReducer';
import { taskState } from './taskState';
import { useTaskEvents } from './useTaskEvents';
import { useTaskPersistence } from './useTaskPersistence';
import { useTaskNavigation } from './useTaskNavigation';
import { TaskContextState } from './types';
import { eventManager } from '@/lib/events/EventManager';
import { taskStateVerifier } from '@/lib/verification/taskStateVerifier';

/**
 * Context for providing task state throughout the application
 */
const TaskContext = createContext<TaskContextState | undefined>(undefined);

/**
 * Provider component for the task context
 * 
 * This component is responsible for:
 * - Initializing task state from storage
 * - Setting up event listeners for task events
 * - Handling persistence of task state
 * - Performing verification to ensure data integrity
 *
 * @param {object} props - The component props
 * @param {ReactNode} props.children - The child components to render
 */
export const TaskProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with data from localStorage
  const [state, dispatch] = useReducer(taskReducer, taskState.getInitialState());
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Debug: Log state on changes
  useEffect(() => {
    console.log("TaskContext state updated:", state);
  }, [state]);
  
  // Set up event handling
  const { forceTasksReload } = useTaskEvents(state.items, state.completed, dispatch);
  
  // Set up persistence
  useTaskPersistence(state.items, state.completed);
  
  // Set up navigation handling
  useTaskNavigation(forceTasksReload);
  
  // Load initial data on mount
  useEffect(() => {
    try {
      const result = taskState.loadFromStorage();
      console.log("TaskContext initial load:", result);
      dispatch({ type: 'LOAD_TASKS', payload: result });
      
      // Force task update after initial load with staggered timing
      // to ensure all components have properly mounted
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
        
        // Check for pending habits
        setTimeout(() => {
          console.log("TaskContext: Initial load complete, checking for pending habits");
          eventManager.emit('habits:check-pending', {});
          setIsInitialized(true);
        }, 250);
      }, 100);
    } catch (error) {
      console.error('Error in initial task loading:', error);
      toast.error('Failed to load tasks');
    }
  }, []);

  // Set up comprehensive verification system for detecting and fixing missing tasks
  useEffect(() => {
    if (!state.isLoaded || !isInitialized) return;
    
    // Initial verification after load
    const initialVerification = setTimeout(() => {
      const missingTasks = taskState.verifyConsistency(state.items);
      
      if (missingTasks.length > 0) {
        console.log(`TaskContext: Initial verification found ${missingTasks.length} missing tasks, adding to state`);
        missingTasks.forEach(task => {
          dispatch({ type: 'ADD_TASK', payload: task });
        });
        
        // Force UI refresh
        window.dispatchEvent(new Event('force-task-update'));
      } else {
        console.log("TaskContext: Initial verification complete, all tasks are in sync");
      }
    }, 500);
    
    // Set up periodic verification to catch desynchronization issues
    const cleanupVerification = taskStateVerifier.setupPeriodicVerification(
      () => state.items,
      (missingTasks) => {
        missingTasks.forEach(task => {
          dispatch({ type: 'ADD_TASK', payload: task });
        });
        window.dispatchEvent(new Event('force-task-update'));
      },
      30000 // Check every 30 seconds
    );
    
    // Set up listener for page visibility changes to force reload on tab focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("TaskContext: Page became visible, forcing reload");
        forceTasksReload();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearTimeout(initialVerification);
      cleanupVerification();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state.isLoaded, state.items, isInitialized, forceTasksReload]);

  return (
    <TaskContext.Provider value={state}>
      {children}
    </TaskContext.Provider>
  );
};

/**
 * Hook for accessing the task context
 * 
 * This hook provides access to the task state and throws an error if
 * used outside of a TaskProvider.
 * 
 * @returns {TaskContextState} The current task context state
 * @throws {Error} If used outside of a TaskProvider
 */
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
