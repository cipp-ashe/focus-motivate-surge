
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { toast } from 'sonner';

interface TaskSelectionContextType {
  selectedTask: Task | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  timerKey: number;
  setTimerKey: React.Dispatch<React.SetStateAction<number>>;
}

// Create a default context with empty values but properly typed
const defaultContextValue: TaskSelectionContextType = {
  selectedTask: null,
  setSelectedTask: () => {},
  timerKey: 0,
  setTimerKey: () => {}
};

const TaskSelectionContext = createContext<TaskSelectionContextType>(defaultContextValue);

export const useTaskSelection = () => {
  const context = useContext(TaskSelectionContext);
  return context;
};

interface TaskSelectionProviderProps {
  children: React.ReactNode;
}

export const TaskSelectionProvider: React.FC<TaskSelectionProviderProps> = ({ children }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [timerKey, setTimerKey] = useState(Date.now());
  
  // Listen for timer initialization events
  useEffect(() => {
    const handleTimerInit = (event: CustomEvent) => {
      try {
        const { taskName, duration, taskId } = event.detail;
        console.log(`TaskSelectionProvider - Received timer:init event for ${taskName} with duration ${duration}`);
        
        // If we have both taskId and taskName, try to find the task
        if (taskId) {
          try {
            const taskList = JSON.parse(localStorage.getItem('taskList') || '[]');
            const task = taskList.find((t: Task) => t.id === taskId);
            
            if (task) {
              console.log('TaskSelectionProvider - Found task in storage:', task);
              setSelectedTask(task);
            } else {
              // If task not found, create a simple object with the provided details
              setSelectedTask({
                id: taskId,
                name: taskName,
                duration: duration,
                createdAt: new Date().toISOString(),
                completed: false,
                taskType: 'timer'
              });
            }
          } catch (e) {
            console.error('Error loading task from storage:', e);
            // Fallback to simple object
            setSelectedTask({
              id: taskId || 'temp-' + Date.now(),
              name: taskName,
              duration: duration,
              createdAt: new Date().toISOString(),
              completed: false,
              taskType: 'timer'
            });
          }
        } else if (taskName) {
          // Simple object with just the name and duration
          setSelectedTask({
            id: 'temp-' + Date.now(),
            name: taskName,
            duration: duration,
            createdAt: new Date().toISOString(),
            completed: false,
            taskType: 'timer'
          });
        }
        
        setTimerKey(Date.now());
      } catch (error) {
        console.error('Error in handleTimerInit:', error);
      }
    };
    
    // Listen for direct task setting through new timer:set-task event
    const handleTimerSetTask = (event: CustomEvent) => {
      try {
        const task = event.detail;
        console.log('TaskSelectionProvider - Received direct task:', task);
        
        if (task) {
          setSelectedTask(task);
          setTimerKey(Date.now());
          toast.success(`Timer set for: ${task.name}`);
        }
      } catch (error) {
        console.error('Error in handleTimerSetTask:', error);
      }
    };
    
    window.addEventListener('timer:init', handleTimerInit as EventListener);
    window.addEventListener('timer:set-task', handleTimerSetTask as EventListener);
    
    // Also listen for task:select events from the event bus
    const unsubscribe = eventBus.on('task:select', (taskId) => {
      try {
        console.log('TaskSelectionProvider - task:select event received for:', taskId);
        
        if (!taskId) {
          console.warn('TaskSelectionProvider - Received null or undefined taskId');
          return;
        }
        
        try {
          const taskList = JSON.parse(localStorage.getItem('taskList') || '[]');
          const task = taskList.find((t: Task) => t.id === taskId);
          
          if (task) {
            console.log('TaskSelectionProvider - Found task in storage:', task);
            setSelectedTask(task);
            setTimerKey(Date.now());
            
            // Only auto-convert to timer if on timer page and not already a timer or focus task
            if (task.taskType !== 'timer' && task.taskType !== 'focus') {
              console.log('Converting selected task to timer type');
              eventBus.emit('task:update', {
                taskId: task.id,
                updates: { taskType: 'timer' }
              });
            }
          } else {
            console.warn('TaskSelectionProvider - Task not found in storage:', taskId);
          }
        } catch (e) {
          console.error('Error processing task:select event:', e);
        }
      } catch (error) {
        console.error('Error in task:select handler:', error);
      }
    });
    
    return () => {
      window.removeEventListener('timer:init', handleTimerInit as EventListener);
      window.removeEventListener('timer:set-task', handleTimerSetTask as EventListener);
      unsubscribe();
    };
  }, []);

  return (
    <TaskSelectionContext.Provider value={{ selectedTask, setSelectedTask, timerKey, setTimerKey }}>
      {children}
    </TaskSelectionContext.Provider>
  );
};
