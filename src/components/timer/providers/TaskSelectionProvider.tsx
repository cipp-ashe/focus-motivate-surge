
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

const TaskSelectionContext = createContext<TaskSelectionContextType | undefined>(undefined);

export const useTaskSelection = () => {
  const context = useContext(TaskSelectionContext);
  if (!context) {
    throw new Error('useTaskSelection must be used within a TaskSelectionProvider');
  }
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
    };
    
    // Listen for direct task setting through new timer:set-task event
    const handleTimerSetTask = (event: CustomEvent) => {
      const task = event.detail;
      console.log('TaskSelectionProvider - Received direct task:', task);
      
      if (task) {
        setSelectedTask(task);
        setTimerKey(Date.now());
        toast.success(`Timer set for: ${task.name}`);
      }
    };
    
    window.addEventListener('timer:init', handleTimerInit as EventListener);
    window.addEventListener('timer:set-task', handleTimerSetTask as EventListener);
    
    // Also listen for task:select events from the event bus
    const unsubscribe = eventBus.on('task:select', (taskId) => {
      console.log('TaskSelectionProvider - task:select event received for:', taskId);
      
      try {
        const taskList = JSON.parse(localStorage.getItem('taskList') || '[]');
        const task = taskList.find((t: Task) => t.id === taskId);
        
        if (task) {
          console.log('TaskSelectionProvider - Found task in storage:', task);
          setSelectedTask(task);
          setTimerKey(Date.now());
          
          // Only auto-convert to timer if on timer page
          if (task.taskType !== 'timer') {
            console.log('Converting selected task to timer type');
            eventBus.emit('task:update', {
              taskId: task.id,
              updates: { taskType: 'timer' }
            });
          }
        }
      } catch (e) {
        console.error('Error processing task:select event:', e);
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
