
import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ActiveTemplate, DayOfWeek } from '@/components/habits/types';
import { eventBus } from '@/lib/eventBus';

interface HabitState {
  templates: ActiveTemplate[];
  todaysHabits: any[];
  progress: Record<string, Record<string, boolean | number>>;
}

interface HabitContextActions {
  addTemplate: (template: Omit<ActiveTemplate, 'templateId'>) => void;
  updateTemplate: (templateId: string, updates: Partial<ActiveTemplate>) => void;
  removeTemplate: (templateId: string) => void;
  updateTemplateOrder: (templates: ActiveTemplate[]) => void;
  updateTemplateDays: (templateId: string, days: DayOfWeek[]) => void;
}

const HabitContext = createContext<HabitState | undefined>(undefined);
const HabitActionsContext = createContext<HabitContextActions | undefined>(undefined);

const initialState: HabitState = {
  templates: [],
  todaysHabits: [],
  progress: {},
};

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer((state: HabitState, action: any) => {
    switch (action.type) {
      case 'LOAD_TEMPLATES':
        return {
          ...state,
          templates: action.payload,
        };
      case 'ADD_TEMPLATE':
        return {
          ...state,
          templates: [...state.templates, action.payload],
        };
      case 'UPDATE_TEMPLATE':
        return {
          ...state,
          templates: state.templates.map(template =>
            template.templateId === action.payload.templateId
              ? { ...template, ...action.payload.updates }
              : template
          ),
        };
      case 'REMOVE_TEMPLATE':
        return {
          ...state,
          templates: state.templates.filter(
            template => template.templateId !== action.payload
          ),
        };
      case 'UPDATE_TEMPLATE_ORDER':
        return {
          ...state,
          templates: action.payload,
        };
      case 'UPDATE_TEMPLATE_DAYS':
        return {
          ...state,
          templates: state.templates.map(template =>
            template.templateId === action.payload.templateId
              ? { ...template, activeDays: action.payload.days }
              : template
          ),
        };
      default:
        return state;
    }
  }, initialState);

  // Load initial data
  useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      try {
        const templates = JSON.parse(localStorage.getItem('habit-templates') || '[]');
        dispatch({ type: 'LOAD_TEMPLATES', payload: templates });
        return templates;
      } catch (error) {
        console.error('Error loading habits:', error);
        toast.error('Failed to load habits');
        return [];
      }
    }
  });

  // Event bus subscriptions
  useEffect(() => {
    const unsubscribers = [
      eventBus.on('habit:template-update', (template) => {
        dispatch({ 
          type: 'UPDATE_TEMPLATE', 
          payload: { templateId: template.templateId, updates: template } 
        });
      }),
    ];

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  const actions: HabitContextActions = {
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
  };

  return (
    <HabitContext.Provider value={state}>
      <HabitActionsContext.Provider value={actions}>
        {children}
      </HabitActionsContext.Provider>
    </HabitContext.Provider>
  );
};

export const useHabitState = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabitState must be used within a HabitProvider');
  }
  return context;
};

export const useHabitActions = () => {
  const context = useContext(HabitActionsContext);
  if (context === undefined) {
    throw new Error('useHabitActions must be used within a HabitProvider');
  }
  return context;
};
