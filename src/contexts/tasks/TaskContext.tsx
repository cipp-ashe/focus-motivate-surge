
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
}

const TaskContext = createContext<TaskContextState | undefined>(undefined);

const initialState: TaskContextState = {
  items: [],
  completed: [],
  selected: null,
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer((state: TaskContextState, action: any) => {
    switch (action.type) {
      case 'LOAD_TASKS':
        return {
          ...state,
          items: action.payload.tasks,
          completed: action.payload.completed,
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
      case 'SELECT_TASK':
        return {
          ...state,
          selected: action.payload,
        };
      default:
        return state;
    }
  }, initialState);

  useEffect(() => {
    // Subscribe to events
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
    ];

    // Cleanup subscriptions
    return () => {
      unsubscribers.forEach(unsub => unsub());
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
