
import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { StateContext, StateContextActions } from '@/types/state';
import type { Task } from '@/types/tasks';
import type { Note } from '@/types/notes';
import type { ActiveTemplate } from '@/components/habits/types';
import { stateReducer } from './stateReducer';
import { eventBus } from '@/lib/eventBus';
import type { TimerMetrics } from '@/types/metrics';

const AppStateContext = createContext<StateContext | undefined>(undefined);
const AppStateActionsContext = createContext<StateContextActions | undefined>(undefined);

const initialState: StateContext = {
  tasks: {
    items: [],
    completed: [],
    selected: null,
  },
  habits: {
    templates: [],
    todaysHabits: [],
    progress: {},
  },
  notes: {
    items: [],
    selected: null,
  },
  relationships: [],
};

interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateProvider = ({ children }: AppStateProviderProps) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  // Load initial data
  useQuery({
    queryKey: ['appState'],
    queryFn: async () => {
      try {
        const tasks = JSON.parse(localStorage.getItem('taskList') || '[]');
        const completed = JSON.parse(localStorage.getItem('completedTasks') || '[]');
        const templates = JSON.parse(localStorage.getItem('habit-templates') || '[]');
        const notes = JSON.parse(localStorage.getItem('notes') || '[]');
        
        dispatch({ 
          type: 'LOAD_INITIAL_STATE', 
          payload: { tasks, completed, templates, notes } 
        });
        
        return { tasks, completed, templates, notes };
      } catch (error) {
        console.error('Error loading initial state:', error);
        toast.error('Failed to load saved data');
        return initialState;
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
      eventBus.on('note:create', (note) => {
        dispatch({ type: 'ADD_NOTE', payload: note });
      }),
      eventBus.on('habit:template-update', (template) => {
        dispatch({ 
          type: 'UPDATE_TEMPLATE', 
          payload: { templateId: template.templateId, updates: template } 
        });
      })
    ];

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  // Actions object
  const actions: StateContextActions = {
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
    
    addNote: (note) => {
      const newNote: Note = {
        ...note,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      eventBus.emit('note:create', newNote);
      toast.success('Note added ✨');
    },
    
    updateNote: (noteId, updates) => {
      dispatch({ type: 'UPDATE_NOTE', payload: { noteId, updates } });
    },
    
    deleteNote: (noteId) => {
      dispatch({ type: 'DELETE_NOTE', payload: noteId });
      toast.success('Note deleted 🗑️');
    },
    
    selectNote: (noteId) => {
      dispatch({ type: 'SELECT_NOTE', payload: noteId });
    },
    
    addTemplate: (template) => {
      const newTemplate: ActiveTemplate = {
        ...template,
        templateId: crypto.randomUUID(),
        customized: false,
      };
      dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
      toast.success('Template added successfully');
    },
    
    updateTemplate: (templateId, updates) => {
      dispatch({ type: 'UPDATE_TEMPLATE', payload: { templateId, updates } });
    },
    
    removeTemplate: (templateId) => {
      dispatch({ type: 'REMOVE_TEMPLATE', payload: templateId });
      toast.success('Template removed');
    },
    
    updateTemplateOrder: (templates) => {
      dispatch({ type: 'UPDATE_TEMPLATE_ORDER', payload: templates });
    },
    
    updateTemplateDays: (templateId, days) => {
      dispatch({ type: 'UPDATE_TEMPLATE_DAYS', payload: { templateId, days } });
    },
    
    addRelationship: (relationship) => {
      dispatch({ type: 'ADD_RELATIONSHIP', payload: relationship });
    },
    
    removeRelationship: (sourceId, targetId) => {
      dispatch({ type: 'REMOVE_RELATIONSHIP', payload: { sourceId, targetId } });
    },
  };

  return (
    <AppStateContext.Provider value={state}>
      <AppStateActionsContext.Provider value={actions}>
        {children}
      </AppStateActionsContext.Provider>
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

export const useAppStateActions = () => {
  const context = useContext(AppStateActionsContext);
  if (context === undefined) {
    throw new Error('useAppStateActions must be used within an AppStateProvider');
  }
  return context;
};
