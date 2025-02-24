
import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ActiveTemplate, DayOfWeek } from '@/components/habits/types';
import { eventBus } from '@/lib/eventBus';
import { useTodaysHabits } from '@/hooks/useTodaysHabits';

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
        const updatedTemplates = state.templates.map(template =>
          template.templateId === action.payload.templateId
            ? { ...template, ...action.payload.updates, customized: true }
            : template
        );
        return {
          ...state,
          templates: updatedTemplates,
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
              ? { ...template, activeDays: action.payload.days, customized: true }
              : template
          ),
        };
      default:
        return state;
    }
  }, initialState);

  // Initialize today's habits
  const { todaysHabits } = useTodaysHabits(state.templates);

  useEffect(() => {
    // Subscribe to template events
    const unsubscribers = [
      eventBus.on('habit:template-update', (template) => {
        if (template.templateId) {
          dispatch({ 
            type: 'UPDATE_TEMPLATE', 
            payload: { templateId: template.templateId, updates: template } 
          });
          localStorage.setItem('habit-templates', JSON.stringify(state.templates));
          toast.success('Template updated successfully');
        } else {
          // If no templateId, this is a new template
          const newTemplate = {
            ...template,
            templateId: crypto.randomUUID(),
            customized: false,
          };
          dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
          const updatedTemplates = [...state.templates, newTemplate];
          localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
          toast.success('Template added successfully');
        }
      }),
      eventBus.on('habit:template-delete', ({ templateId }) => {
        dispatch({ type: 'REMOVE_TEMPLATE', payload: templateId });
        const updatedTemplates = state.templates.filter(t => t.templateId !== templateId);
        localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
        toast.success('Template deleted successfully');
      })
    ];

    return () => unsubscribers.forEach(unsub => unsub());
  }, [state.templates]);

  // Load initial templates
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

  const actions: HabitContextActions = {
    addTemplate: (template) => {
      const newTemplate = {
        ...template,
        templateId: crypto.randomUUID(),
        customized: false,
      };
      dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
      const updatedTemplates = [...state.templates, newTemplate];
      localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
      toast.success('Template added successfully');
    },
    
    updateTemplate: (templateId, updates) => {
      dispatch({ type: 'UPDATE_TEMPLATE', payload: { templateId, updates } });
      const updatedTemplates = state.templates.map(template =>
        template.templateId === templateId
          ? { ...template, ...updates, customized: true }
          : template
      );
      localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
      toast.success('Template updated successfully');
    },
    
    removeTemplate: (templateId) => {
      dispatch({ type: 'REMOVE_TEMPLATE', payload: templateId });
      const updatedTemplates = state.templates.filter(t => t.templateId !== templateId);
      localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
      toast.success('Template removed successfully');
    },
    
    updateTemplateOrder: (templates) => {
      dispatch({ type: 'UPDATE_TEMPLATE_ORDER', payload: templates });
      localStorage.setItem('habit-templates', JSON.stringify(templates));
    },
    
    updateTemplateDays: (templateId, days) => {
      dispatch({ type: 'UPDATE_TEMPLATE_DAYS', payload: { templateId, days } });
      const updatedTemplates = state.templates.map(template =>
        template.templateId === templateId
          ? { ...template, activeDays: days, customized: true }
          : template
      );
      localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
      toast.success('Template days updated successfully');
    },
  };

  return (
    <HabitContext.Provider value={{ ...state, todaysHabits }}>
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
