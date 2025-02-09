
import { createContext, useContext, useReducer, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { StateContext, StateContextActions } from '@/types/state';
import type { Task } from '@/types/tasks';
import type { Note } from '@/types/notes';
import type { ActiveTemplate, HabitDetail } from '@/components/habits/types';

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
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(stateReducer, initialState);

  // Load initial data from localStorage
  const { data: storedData } = useQuery({
    queryKey: ['appState'],
    queryFn: () => {
      const tasks = JSON.parse(localStorage.getItem('taskList') || '[]');
      const completed = JSON.parse(localStorage.getItem('completedTasks') || '[]');
      const templates = JSON.parse(localStorage.getItem('habit-templates') || '[]');
      const notes = JSON.parse(localStorage.getItem('notes') || '[]');
      
      return {
        tasks,
        completed,
        templates,
        notes,
      };
    },
  });

  // Sync state changes to localStorage
  const persistState = (newState: StateContext) => {
    localStorage.setItem('taskList', JSON.stringify(newState.tasks.items));
    localStorage.setItem('completedTasks', JSON.stringify(newState.tasks.completed));
    localStorage.setItem('habit-templates', JSON.stringify(newState.habits.templates));
    localStorage.setItem('notes', JSON.stringify(newState.notes.items));
    
    // Dispatch events for components listening to storage changes
    window.dispatchEvent(new Event('tasksUpdated'));
    window.dispatchEvent(new Event('templatesUpdated'));
    window.dispatchEvent(new Event('notesUpdated'));
  };

  // Actions
  const actions: StateContextActions = {
    addTask: (task) => {
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      
      dispatch({ type: 'ADD_TASK', payload: newTask });
      toast.success('Task added 📝');
    },
    
    updateTask: (taskId, updates) => {
      dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates } });
    },
    
    deleteTask: (taskId) => {
      dispatch({ type: 'DELETE_TASK', payload: taskId });
      toast.success('Task removed 🗑️');
    },
    
    completeTask: (taskId, metrics) => {
      dispatch({ type: 'COMPLETE_TASK', payload: { taskId, metrics } });
      toast.success('Task completed 🎯');
    },
    
    selectTask: (taskId) => {
      dispatch({ type: 'SELECT_TASK', payload: taskId });
    },
    
    addTemplate: (template) => {
      dispatch({ type: 'ADD_TEMPLATE', payload: { ...template, templateId: crypto.randomUUID() } });
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
      
      dispatch({ type: 'ADD_NOTE', payload: newNote });
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
