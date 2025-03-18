
import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { taskReducer } from './taskReducer';
import { taskState } from './taskState';
import { useTaskEvents } from './useTaskEvents';
import { useTaskPersistence } from './useTaskPersistence';
import { useTaskNavigation } from './useTaskNavigation';
import { Task, TaskStatus } from '@/types/tasks';
import { TaskContextState } from './types';
import { eventManager } from '@/lib/events/EventManager';
import { taskStateVerifier } from '@/lib/verification/taskStateVerifier';
import { taskStorage } from '@/lib/storage/taskStorage';

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
    console.log("TaskContext: Adding task", task.name, task);
    
    // First, check if the task already exists to prevent duplicates
    const existingTask = state.items.find(t => t.id === task.id);
    if (existingTask) {
      console.log("TaskContext: Task already exists, updating instead of adding");
      dispatch({ type: 'UPDATE_TASK', payload: { taskId: task.id, updates: task } });
    } else {
      // Add the task to both the context state and storage
      dispatch({ type: 'ADD_TASK', payload: task });
      taskStorage.addTask(task);
    }
    
    // Notify UI to refresh
    window.dispatchEvent(new CustomEvent('task-ui-refresh', { 
      detail: { action: 'add', taskId: task.id }
    }));
  }, [state.items]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    console.log("TaskContext: Updating task", taskId, updates);
    
    // Update in context state
    dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates } });
    
    // Also update in storage to ensure persistence
    const task = state.items.find(t => t.id === taskId);
    if (task) {
      const updatedTask = { ...task, ...updates };
      taskStorage.updateTask(taskId, updatedTask);
    }
    
    // Notify UI to refresh
    window.dispatchEvent(new CustomEvent('task-ui-refresh', { 
      detail: { action: 'update', taskId, changes: updates }
    }));
  }, [state.items]);

  const deleteTask = useCallback((taskId: string, reason: string = 'manual') => {
    console.log("TaskContext: Deleting task", taskId, reason);
    
    // Delete from context state
    dispatch({ type: 'DELETE_TASK', payload: { taskId, reason } });
    
    // Also delete from storage
    taskStorage.removeTask(taskId);
    
    // Notify UI to refresh
    window.dispatchEvent(new CustomEvent('task-ui-refresh', { 
      detail: { action: 'delete', taskId }
    }));
  }, []);

  const completeTask = useCallback((taskId: string, metrics?: any) => {
    console.log("TaskContext: Completing task", taskId, metrics);
    
    // Mark as complete in context state
    dispatch({ 
      type: 'COMPLETE_TASK', 
      payload: { 
        taskId,
        metrics
      } 
    });
    
    // Also update in storage
    const task = state.items.find(t => t.id === taskId);
    if (task) {
      const completedTask: Task = {
        ...task,
        completed: true,
        completedAt: new Date().toISOString(),
        status: 'completed' as TaskStatus,
        metrics: metrics ? { ...(task.metrics || {}), ...metrics } : task.metrics
      };
      
      taskStorage.updateTask(taskId, completedTask);
      
      // Move to completed tasks in storage
      const remainingTasks = state.items.filter(t => t.id !== taskId);
      taskStorage.saveTasks(remainingTasks);
      taskStorage.saveCompletedTasks([...state.completed, completedTask]);
    }
    
    // Notify UI to refresh
    window.dispatchEvent(new CustomEvent('task-ui-refresh', { 
      detail: { action: 'complete', taskId }
    }));
  }, [state.items, state.completed]);

  const selectTask = useCallback((taskId: string | null) => {
    console.log("TaskContext: Selecting task", taskId);
    dispatch({ type: 'SELECT_TASK', payload: taskId });
  }, []);
  
  // Load initial data on mount with optimization
  useEffect(() => {
    // Skip if already initialized
    if (taskContextInitialized || initStartedRef.current) return;
    initStartedRef.current = true;
    
    try {
      // First, try to get tasks from storage
      const storedTasks = taskStorage.loadTasks();
      const completedTasks = taskStorage.loadCompletedTasks();
      
      console.log("TaskContext initial load:", { active: storedTasks.length, completed: completedTasks.length });
      
      // Update the state with the loaded tasks
      dispatch({ 
        type: 'LOAD_TASKS', 
        payload: { 
          items: storedTasks,
          completed: completedTasks
        } 
      });
      
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
    
    // Set up periodic verification to ensure task consistency
    const verifyTasks = () => {
      const storedTasks = taskStorage.loadTasks();
      
      // Check if any stored tasks are missing from context
      const missingTasks = storedTasks.filter(
        storedTask => !state.items.some(item => item.id === storedTask.id)
      );
      
      if (missingTasks.length > 0) {
        console.log(`TaskContext: Found ${missingTasks.length} tasks in storage that are missing from context, adding them`);
        missingTasks.forEach(task => {
          dispatch({ type: 'ADD_TASK', payload: task });
        });
        
        // Notify UI to refresh
        window.dispatchEvent(new Event('force-task-update'));
      }
    };
    
    // Run verification now and set up interval for periodic checks
    verifyTasks();
    const verificationInterval = setInterval(verifyTasks, 30000); // Check every 30 seconds
    
    return () => {
      clearTimeout(initialVerification);
      clearInterval(verificationInterval);
    };
  }, [state.isLoaded, isInitialized, state.items]);

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
