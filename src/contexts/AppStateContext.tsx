import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { StateContext, StateContextActions } from '@/types/state';
import type { Task } from '@/types/tasks';
import type { Note } from '@/types/notes';
import type { ActiveTemplate, DayOfWeek } from '@/components/habits/types';
import { stateReducer, StateAction } from './stateReducer';
import { eventBus } from '@/lib/eventBus';
import { relationshipManager } from '@/lib/relationshipManager';

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

  // Load initial data from localStorage
  useQuery({
    queryKey: ['appState'],
    queryFn: () => {
      const tasks = JSON.parse(localStorage.getItem('taskList') || '[]');
      const completed = JSON.parse(localStorage.getItem('completedTasks') || '[]');
      const templates = JSON.parse(localStorage.getItem('habit-templates') || '[]');
      const notes = JSON.parse(localStorage.getItem('notes') || '[]');
      
      dispatch({ type: 'LOAD_INITIAL_STATE', payload: { tasks, completed, templates, notes } });
      return { tasks, completed, templates, notes };
    },
  });

  // Set up event listeners
  useEffect(() => {
    const unsubscribers = [
      // Task events
      eventBus.on('task:create', (task) => {
        dispatch({ type: 'ADD_TASK', payload: task });
      }),
      eventBus.on('task:complete', (taskId, metrics) => {
        dispatch({ type: 'COMPLETE_TASK', payload: { taskId, metrics } });
      }),
      
      // Note events
      eventBus.on('note:create', (note) => {
        dispatch({ type: 'ADD_NOTE', payload: note });
      }),
      
      // Habit events
      eventBus.on('habit:generate-task', (template) => {
        dispatch({ type: 'ADD_TEMPLATE', payload: template });
      })
    ];

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  // Sync state changes to localStorage
  const persistState = (newState: StateContext) => {
    localStorage.setItem('taskList', JSON.stringify(newState.tasks.items));
    localStorage.setItem('completedTasks', JSON.stringify(newState.tasks.completed));
    localStorage.setItem('habit-templates', JSON.stringify(newState.habits.templates));
    localStorage.setItem('notes', JSON.stringify(newState.notes.items));
  };

  const actions: StateContextActions = {
    // Task actions
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
      eventBus.emit('task:complete', taskId, metrics);
    },
    
    selectTask: (taskId) => {
      eventBus.emit('task:select', taskId);
      dispatch({ type: 'SELECT_TASK', payload: taskId });
    },
    
    addTemplate: (template) => {
      eventBus.emit('habit:generate-task', template);
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
