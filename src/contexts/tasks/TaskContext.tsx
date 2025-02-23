
import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Task } from '@/types/tasks';
import type { TimerMetrics } from '@/types/metrics';
import { eventBus } from '@/lib/eventBus';

interface TaskState {
  items: Task[];
  completed: Task[];
  selected: string | null;
}

interface TaskContextActions {
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  completeTask: (taskId: string, metrics?: TimerMetrics) => void;
  selectTask: (taskId: string | null) => void;
}

const TaskContext = createContext<TaskState | undefined>(undefined);
const TaskActionsContext = createContext<TaskContextActions | undefined>(undefined);

const initialState: TaskState = {
  items: [],
  completed: [],
  selected: null,
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer((state: TaskState, action: any) => {
    switch (action.type) {
      case 'LOAD_TASKS':
        return {
          ...state,
          items: action.payload.tasks,
          completed: action.payload.completed,
        };
      case 'ADD_TASK':
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
      case 'DELETE_TASK':
        return {
          ...state,
          items: state.items.filter(task => task.id !== action.payload),
          selected: state.selected === action.payload ? null : state.selected,
        };
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

  // Load initial data
  useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        const tasks = JSON.parse(localStorage.getItem('taskList') || '[]');
        const completed = JSON.parse(localStorage.getItem('completedTasks') || '[]');
        
        dispatch({ type: 'LOAD_TASKS', payload: { tasks, completed } });
        return { tasks, completed };
      } catch (error) {
        console.error('Error loading tasks:', error);
        toast.error('Failed to load tasks');
        return { tasks: [], completed: [] };
      }
    }
  });

  // Event bus subscriptions
  useEffect(() => {
    const unsubscribers = [
      eventBus.on('task:create', (task) => {
        dispatch({ type: 'ADD_TASK', payload: task });
      }),
      eventBus.on('task:complete', ({ taskId, metrics }) => {
        dispatch({ type: 'COMPLETE_TASK', payload: { taskId, metrics } });
      }),
    ];

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  const actions: TaskContextActions = {
    addTask: (task) => {
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      eventBus.emit('task:create', newTask);
    },
    
    updateTask: (taskId, updates) => {
      eventBus.emit('task:update', { taskId, updates });
      dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates } });
    },
    
    deleteTask: (taskId) => {
      eventBus.emit('task:delete', taskId);
      dispatch({ type: 'DELETE_TASK', payload: taskId });
    },
    
    completeTask: (taskId, metrics) => {
      const timerMetrics: TimerMetrics = {
        ...metrics,
        startTime: null,
        lastPauseTimestamp: null,
        isPaused: false,
        pausedTimeLeft: null,
        endTime: metrics?.endTime ? new Date(metrics.endTime) : null
      };
      eventBus.emit('task:complete', { taskId, metrics: timerMetrics });
      dispatch({ type: 'COMPLETE_TASK', payload: { taskId, metrics: timerMetrics } });
    },
    
    selectTask: (taskId) => {
      eventBus.emit('task:select', taskId);
      dispatch({ type: 'SELECT_TASK', payload: taskId });
    },
  };

  return (
    <TaskContext.Provider value={state}>
      <TaskActionsContext.Provider value={actions}>
        {children}
      </TaskActionsContext.Provider>
    </TaskContext.Provider>
  );
};

export const useTaskState = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskState must be used within a TaskProvider');
  }
  return context;
};

export const useTaskActions = () => {
  const context = useContext(TaskActionsContext);
  if (context === undefined) {
    throw new Error('useTaskActions must be used within a TaskProvider');
  }
  return context;
};
