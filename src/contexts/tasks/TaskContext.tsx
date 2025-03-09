
import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { taskReducer } from './taskReducer';

interface TaskContextState {
  items: Task[];
  completed: Task[];
  selected: string | null;
  isLoaded: boolean;
}

const TaskContext = createContext<TaskContextState | undefined>(undefined);

const initialState: TaskContextState = {
  items: [],
  completed: [],
  selected: null,
  isLoaded: false,
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load tasks from storage
  const loadTasksFromStorage = () => {
    try {
      const tasks = JSON.parse(localStorage.getItem('taskList') || '[]');
      const completed = JSON.parse(localStorage.getItem('completedTasks') || '[]');
      
      console.log("TaskContext: Loading tasks from storage", tasks.length, "completed:", completed.length);
      dispatch({ type: 'LOAD_TASKS', payload: { tasks, completed } });

      return { tasks, completed };
    } catch (error) {
      console.error('Error loading tasks from storage:', error);
      toast.error('Failed to load tasks');
      return { tasks: [], completed: [] };
    }
  };

  // Force a reload of tasks when navigating between pages
  useEffect(() => {
    // Listen for route changes
    const handleRouteChange = () => {
      console.log("TaskContext: Route changed, reloading tasks");
      loadTasksFromStorage();
    };

    // Add event listener for navigation events
    window.addEventListener('popstate', handleRouteChange);
    
    // Initial load
    loadTasksFromStorage();
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Subscribe to events
  useEffect(() => {
    const unsubscribers = [
      eventBus.on('task:create', (task) => {
        console.log("TaskContext: Creating task in context", task);
        
        // Verify task doesn't already exist
        const tasksFromStorage = JSON.parse(localStorage.getItem('taskList') || '[]');
        
        // Check for existing task by ID or habit relationship
        const exists = tasksFromStorage.some((t: Task) => {
          return t.id === task.id || 
            (t.relationships?.habitId === task.relationships?.habitId && 
             t.relationships?.date === task.relationships?.date);
        });
        
        if (!exists) {
          console.log("TaskContext: Task doesn't exist yet, adding to context", task);
          dispatch({ type: 'ADD_TASK', payload: task });
          
          // Also update localStorage directly to ensure persistence
          const updatedTasks = [...tasksFromStorage, task];
          localStorage.setItem('taskList', JSON.stringify(updatedTasks));
        } else {
          console.log("TaskContext: Task already exists, skipping", task.id);
        }
      }),
      
      eventBus.on('task:complete', ({ taskId, metrics }) => {
        console.log("TaskContext: Completing task", taskId);
        dispatch({ type: 'COMPLETE_TASK', payload: { taskId, metrics } });
      }),
      
      eventBus.on('task:delete', ({ taskId, reason }) => {
        console.log("TaskContext: Deleting task", taskId, "reason:", reason);
        dispatch({ type: 'DELETE_TASK', payload: { taskId, reason } });
      }),
      
      eventBus.on('task:update', ({ taskId, updates }) => {
        console.log("TaskContext: Updating task", taskId, updates);
        dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates } });
      }),
      
      eventBus.on('task:select', (taskId) => {
        console.log("TaskContext: Selecting task", taskId);
        dispatch({ type: 'SELECT_TASK', payload: taskId });
      }),
      
      eventBus.on('habit:template-delete', ({ templateId }) => {
        console.log("TaskContext: Received template delete event for", templateId);
        dispatch({ type: 'DELETE_TASKS_BY_TEMPLATE', payload: { templateId } });
      }),
      
      // Add handler for habits:check-pending event
      eventBus.on('habits:check-pending', () => {
        console.log("TaskContext: Checking for pending habits to schedule");
        // Trigger a reprocessing of today's habits via the event bus
        eventBus.emit('habits:processed', {});
        
        // Also ensure we fetch latest tasks from localStorage
        setTimeout(() => {
          const tasks = JSON.parse(localStorage.getItem('taskList') || '[]');
          if (tasks.length > 0 && state.items.length !== tasks.length) {
            console.log("TaskContext: Found mismatch between localStorage and state, reloading tasks");
            loadTasksFromStorage();
          }
        }, 100);
      }),
    ];

    // Listen for global force-task-update events
    const handleForceUpdate = () => {
      console.log("TaskContext: Force updating task list");
      loadTasksFromStorage();
    };
    
    window.addEventListener('force-task-update', handleForceUpdate);
    
    // Cleanup subscriptions
    return () => {
      unsubscribers.forEach(unsub => unsub());
      window.removeEventListener('force-task-update', handleForceUpdate);
    };
  }, [state.items.length]);

  // Load initial data
  useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const result = loadTasksFromStorage();
      
      // Force task update after initial load
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
        
        // Also check for pending habits
        eventBus.emit('habits:check-pending', {});
      }, 100);
      
      return result;
    }
  });

  // Persist changes to localStorage whenever state changes
  useEffect(() => {
    console.log("TaskContext: Persisting", state.items.length, "tasks to localStorage");
    localStorage.setItem('taskList', JSON.stringify(state.items));
    localStorage.setItem('completedTasks', JSON.stringify(state.completed));
  }, [state.items, state.completed]);

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
