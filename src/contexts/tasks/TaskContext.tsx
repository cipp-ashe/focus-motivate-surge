import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { taskReducer } from './taskReducer';
import { taskState } from './taskState';
import { useTaskEvents } from './useTaskEvents';
import { useTaskPersistence } from './useTaskPersistence';
import { useTaskNavigation } from './useTaskNavigation';
import { Task } from '@/types/tasks';
import { TaskContextState } from './types';
import { eventManager } from '@/lib/events/EventManager';
import { taskStateVerifier } from '@/lib/verification/taskStateVerifier';

/**
 * Context for providing task state throughout the application
 */
const TaskContext = createContext<TaskContextState | undefined>(undefined);

// Global flags for optimization
let taskContextInitialized = false;
let initialVerificationDone = false;

/**
 * Provider component for the task context
 */
export const TaskProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with data from localStorage
  const [state, dispatch] = useReducer(taskReducer, taskState.getInitialState());
  const [isInitialized, setIsInitialized] = useState(false);
  const initStartedRef = useRef(false);
  const habitCheckRef = useRef(false);
  
  // Set up event handling
  const { forceTasksReload } = useTaskEvents(state.items, state.completed, dispatch);
  
  // Set up persistence
  useTaskPersistence(state.items, state.completed);
  
  // Set up navigation handling
  useTaskNavigation(forceTasksReload);

  // Add callback functions for common task operations
  const addTask = useCallback((task: Task) => {
    dispatch({ type: 'ADD_TASK', payload: task });
    window.dispatchEvent(new CustomEvent('task-ui-refresh', { 
      detail: { action: 'add', taskId: task.id }
    }));
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates } });
    window.dispatchEvent(new CustomEvent('task-ui-refresh', { 
      detail: { action: 'update', taskId, changes: updates }
    }));
  }, []);

  const deleteTask = useCallback((taskId: string, reason: string = 'manual') => {
    dispatch({ type: 'DELETE_TASK', payload: { taskId, reason } });
    window.dispatchEvent(new CustomEvent('task-ui-refresh', { 
      detail: { action: 'delete', taskId }
    }));
  }, []);

  const completeTask = useCallback((taskId: string, metrics?: any) => {
    dispatch({ 
      type: 'COMPLETE_TASK', 
      payload: { 
        taskId,
        metrics
      } 
    });
    window.dispatchEvent(new CustomEvent('task-ui-refresh', { 
      detail: { action: 'complete', taskId }
    }));
  }, []);

  const selectTask = useCallback((taskId: string | null) => {
    dispatch({ type: 'SELECT_TASK', payload: taskId });
  }, []);
  
  // Load initial data on mount with optimization
  useEffect(() => {
    // Skip if already initialized
    if (taskContextInitialized || initStartedRef.current) return;
    initStartedRef.current = true;
    
    try {
      const result = taskState.loadFromStorage();
      console.log("TaskContext initial load:", result);
      dispatch({ type: 'LOAD_TASKS', payload: result });
      
      // Only trigger habit check once
      if (!habitCheckRef.current) {
        habitCheckRef.current = true;
        console.log("TaskContext: Initial load complete, checking for pending habits");
        eventManager.emit('habits:check-pending', {});
        setIsInitialized(true);
        taskContextInitialized = true;
      }
    } catch (error) {
      console.error('Error in initial task loading:', error);
      toast.error('Failed to load tasks');
    }
  }, []);

  // Set up verification with much less frequent checks
  useEffect(() => {
    if (!state.isLoaded || !isInitialized || initialVerificationDone) return;
    initialVerificationDone = true;
    
    // Initial verification after load (just once)
    const initialVerification = setTimeout(() => {
      console.log("TaskContext: Initial verification complete, all tasks are in sync");
    }, 200);
    
    // Set up less frequent verification
    const cleanupVerification = taskStateVerifier.setupPeriodicVerification(
      () => state.items,
      (missingTasks) => {
        if (missingTasks.length > 0) {
          missingTasks.forEach(task => {
            dispatch({ type: 'ADD_TASK', payload: task });
          });
        }
      },
      300000 // Check every 5 minutes instead of every minute
    );
    
    return () => {
      clearTimeout(initialVerification);
      cleanupVerification();
    };
  }, [state.isLoaded, isInitialized]);

  // Create context value
  const contextValue = {
    ...state,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    selectTask
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

/**
 * Hook for accessing the task context
 */
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
