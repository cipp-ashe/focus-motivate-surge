import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Task } from '@/types/tasks';
import type { TimerMetrics } from '@/types/metrics';
import { eventBus } from '@/lib/eventBus';

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
  const [state, dispatch] = useReducer((state: TaskContextState, action: any) => {
    switch (action.type) {
      case 'LOAD_TASKS':
        return {
          ...state,
          items: action.payload.tasks,
          completed: action.payload.completed,
          isLoaded: true,
        };
      case 'ADD_TASK':
        // Avoid duplicate tasks
        if (state.items.some(task => {
          // Check for duplicate by both ID and relationship to habit
          return task.id === action.payload.id || 
            (task.relationships?.habitId === action.payload.relationships?.habitId && 
             task.relationships?.date === action.payload.relationships?.date);
        })) {
          return state;
        }
        return {
          ...state,
          items: [...state.items, action.payload],
        };
      case 'UPDATE_TASK':
        return {
          ...state,
          items: state.items.map(task =>
            task.id === action.payload.taskId
              ? { ...task, ...action.payload.updates }
              : task
          ),
        };
      case 'DELETE_TASK': {
        const isInItems = state.items.some(task => task.id === action.payload.taskId);
        const isInCompleted = state.completed.some(task => task.id === action.payload.taskId);

        console.log(`TaskContext: Deleting task ${action.payload.taskId}, exists in items: ${isInItems}, exists in completed: ${isInCompleted}`);

        return {
          ...state,
          items: isInItems ? state.items.filter(task => task.id !== action.payload.taskId) : state.items,
          completed: isInCompleted ? state.completed.filter(task => task.id !== action.payload.taskId) : state.completed,
          selected: state.selected === action.payload.taskId ? null : state.selected,
        };
      }
      case 'COMPLETE_TASK': {
        const task = state.items.find(t => t.id === action.payload.taskId);
        if (!task) return state;

        const completedTask = {
          ...task,
          completed: true,
          metrics: action.payload.metrics,
        };

        return {
          ...state,
          items: state.items.filter(t => t.id !== action.payload.taskId),
          completed: [...state.completed, completedTask],
          selected: state.selected === action.payload.taskId ? null : state.selected,
        };
      }
      case 'DELETE_TASKS_BY_TEMPLATE': {
        const templateId = action.payload.templateId;
        console.log(`TaskContext: Deleting all tasks for template ${templateId}`);
        
        // Filter out tasks from this template
        const updatedItems = state.items.filter(task => 
          task.relationships?.templateId !== templateId
        );
        
        const updatedCompleted = state.completed.filter(task => 
          task.relationships?.templateId !== templateId
        );
        
        // Reset selected if it was part of the deleted template
        const selectedTask = state.selected ? 
          state.items.find(t => t.id === state.selected) : 
          null;
          
        const resetSelected = selectedTask?.relationships?.templateId === templateId;
        
        console.log(`TaskContext: Removed ${state.items.length - updatedItems.length} active tasks and ${state.completed.length - updatedCompleted.length} completed tasks`);
        
        return {
          ...state,
          items: updatedItems,
          completed: updatedCompleted,
          selected: resetSelected ? null : state.selected,
        };
      }
      case 'SELECT_TASK':
        return {
          ...state,
          selected: action.payload,
        };
      default:
        return state;
    }
  }, initialState);

  // Force a reload of tasks when navigating between pages
  useEffect(() => {
    const loadTasksFromStorage = () => {
      try {
        const tasks = JSON.parse(localStorage.getItem('taskList') || '[]');
        const completed = JSON.parse(localStorage.getItem('completedTasks') || '[]');
        
        console.log("TaskContext: Loading tasks from storage on navigation", tasks.length, "completed:", completed.length);
        dispatch({ type: 'LOAD_TASKS', payload: { tasks, completed } });

        // Force a UI update after loading tasks
        setTimeout(() => {
          window.dispatchEvent(new Event('force-task-update'));
        }, 50);
      } catch (error) {
        console.error('Error loading tasks from storage:', error);
      }
    };

    // Listen for route changes
    const handleRouteChange = () => {
      console.log("TaskContext: Route changed, reloading tasks");
      loadTasksFromStorage();
    };

    // Add event listener for navigation events
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Subscribe to events
  useEffect(() => {
    const unsubscribers = [
      eventBus.on('task:create', (task) => {
        console.log("TaskContext: Creating task in context", task);
        dispatch({ type: 'ADD_TASK', payload: task });
        toast.success('Task added 📝');
      }),
      eventBus.on('task:complete', ({ taskId, metrics }) => {
        console.log("TaskContext: Completing task", taskId);
        dispatch({ type: 'COMPLETE_TASK', payload: { taskId, metrics } });
        toast.success('Task completed 🎯');
      }),
      eventBus.on('task:delete', ({ taskId, reason }) => {
        console.log("TaskContext: Deleting task", taskId, "reason:", reason);
        dispatch({ type: 'DELETE_TASK', payload: { taskId, reason } });
        
        // Only show toast for manual deletions
        if (reason === 'manual') {
          toast.success('Task deleted 🗑️');
        } else if (reason === 'template-removed') {
          toast.info('Task removed with habit template');
        }
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
    ];

    // Listen for global force-task-update events
    const handleForceUpdate = () => {
      console.log("TaskContext: Force updating task list");
      // Re-load tasks from localStorage to ensure everything is in sync
      const tasks = JSON.parse(localStorage.getItem('taskList') || '[]');
      const completed = JSON.parse(localStorage.getItem('completedTasks') || '[]');
      dispatch({ type: 'LOAD_TASKS', payload: { tasks, completed } });
    };
    
    window.addEventListener('force-task-update', handleForceUpdate);
    
    // Cleanup subscriptions
    return () => {
      unsubscribers.forEach(unsub => unsub());
      window.removeEventListener('force-task-update', handleForceUpdate);
    };
  }, []);

  // Load initial data
  useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        const tasks = JSON.parse(localStorage.getItem('taskList') || '[]');
        const completed = JSON.parse(localStorage.getItem('completedTasks') || '[]');
        
        console.log("TaskContext: Loading initial tasks", tasks.length, "completed:", completed.length);
        dispatch({ type: 'LOAD_TASKS', payload: { tasks, completed } });
        
        // Force task update after initial load
        setTimeout(() => {
          window.dispatchEvent(new Event('force-task-update'));
        }, 100);
        
        return { tasks, completed };
      } catch (error) {
        console.error('Error loading tasks:', error);
        toast.error('Failed to load tasks');
        return { tasks: [], completed: [] };
      }
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
