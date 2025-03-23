import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { HabitContext as HabitContextType, HabitState, initialState } from './types';
import { eventManager } from '@/lib/events/EventManager';
import { ActiveTemplate, DayOfWeek } from '@/components/habits/types';
import { EventType } from '@/types/events';

// Create the context
const HabitContext = createContext<HabitContextType>({} as HabitContextType);

// Create a reducer function
const habitReducer = (state: HabitState, action: any): HabitState => {
  switch (action.type) {
    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload, isLoaded: true };
    case 'ADD_TEMPLATE':
      return { ...state, templates: [...state.templates, action.payload] };
    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.map(template =>
          template.templateId === action.payload.templateId
            ? { ...template, ...action.payload.updates }
            : template
        )
      };
    case 'REMOVE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.filter(
          template => template.templateId !== action.payload
        )
      };
    case 'UPDATE_TEMPLATE_ORDER':
      return { ...state, templates: action.payload };
    default:
      return state;
  }
};

// Create the provider component
export const HabitProvider: React.FC<{
  children: React.ReactNode;
  initialState?: HabitState;
}> = ({ children, initialState: initialStateProps }) => {
  const [state, dispatch] = useReducer(habitReducer, initialStateProps || initialState);

  // Event handlers for template actions
  useEffect(() => {
    const handleTemplateAdd = (template: ActiveTemplate) => {
      dispatch({ type: 'ADD_TEMPLATE', payload: template });
    };

    const handleTemplateUpdate = (template: ActiveTemplate) => {
      dispatch({
        type: 'UPDATE_TEMPLATE',
        payload: { templateId: template.templateId, updates: template },
      });
    };

    const handleTemplateRemove = (data: { templateId: string }) => {
      dispatch({ type: 'REMOVE_TEMPLATE', payload: data.templateId });
    };

    const handleTemplateOrderUpdate = (templates: ActiveTemplate[]) => {
      dispatch({ type: 'UPDATE_TEMPLATE_ORDER', payload: templates });
    };

    const handleTemplateDaysUpdate = (template: ActiveTemplate) => {
      dispatch({
        type: 'UPDATE_TEMPLATE',
        payload: {
          templateId: template.templateId,
          updates: { activeDays: template.activeDays, customized: true },
        },
      });
    };

    // Subscribe to template events
    const unsubscribeAdd = eventManager.on('habit:template-add' as EventType, handleTemplateAdd);
    const unsubscribeUpdate = eventManager.on('habit:template-update' as EventType, handleTemplateUpdate);
    const unsubscribeRemove = eventManager.on('habit:template-remove' as EventType, handleTemplateRemove);
    const unsubscribeOrder = eventManager.on('habit:template-order-update' as EventType, handleTemplateOrderUpdate);
    const unsubscribeDays = eventManager.on('habit:template-days-update' as EventType, handleTemplateDaysUpdate);

    return () => {
      unsubscribeAdd();
      unsubscribeUpdate();
      unsubscribeRemove();
      unsubscribeOrder();
      unsubscribeDays();
    };
  }, []);

  // Actions for the context
  const actions = {
    addTemplate: (template: Omit<ActiveTemplate, 'templateId'>) => {
      const newTemplate: ActiveTemplate = {
        ...template,
        templateId: template.templateId || `template-${Date.now()}`,
        habits: template.habits || [],
        activeDays: template.activeDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      };
      dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
      return newTemplate.templateId;
    },
    updateTemplate: (templateId: string, updates: Partial<ActiveTemplate>) => {
      dispatch({ 
        type: 'UPDATE_TEMPLATE', 
        payload: { templateId, updates } 
      });
      return templateId;
    },
    removeTemplate: (templateId: string) => {
      dispatch({ type: 'REMOVE_TEMPLATE', payload: templateId });
    },
    updateTemplateOrder: (templates: ActiveTemplate[]) => {
      dispatch({ type: 'UPDATE_TEMPLATE_ORDER', payload: templates });
    },
    updateTemplateDays: (templateId: string, days: DayOfWeek[]) => {
      dispatch({
        type: 'UPDATE_TEMPLATE',
        payload: { templateId, updates: { activeDays: days, customized: true } },
      });
      return templateId;
    },
    addCustomTemplate: () => {},
    removeCustomTemplate: () => {},
    reorderTemplates: () => {},
    findTemplateById: (templateId: string) => {
      return state.templates.find(t => t.templateId === templateId);
    },
    reloadTemplates: () => {}
  };

  return (
    <HabitContext.Provider value={{ ...state, ...actions }}>
      {children}
    </HabitContext.Provider>
  );
};

// Create custom hooks for accessing the context
export const useHabitContext = () => useContext(HabitContext);
export const useHabitState = () => {
  const context = useContext(HabitContext);
  return {
    templates: context.templates || [],
    todaysHabits: context.todaysHabits || [],
    progress: context.progress || {},
    customTemplates: context.customTemplates || [],
    isLoaded: context.isLoaded || false
  };
};

export const useHabitActions = () => {
  const context = useContext(HabitContext);
  return {
    addTemplate: context.addTemplate,
    updateTemplate: context.updateTemplate,
    removeTemplate: context.removeTemplate,
    updateTemplateOrder: context.updateTemplateOrder,
    updateTemplateDays: context.updateTemplateDays,
    addCustomTemplate: context.addCustomTemplate,
    removeCustomTemplate: context.removeCustomTemplate,
    reorderTemplates: context.reorderTemplates,
    findTemplateById: context.findTemplateById,
    reloadTemplates: context.reloadTemplates
  };
};

export default HabitContext;
