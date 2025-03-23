
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { type HabitState, type HabitContextActions, type HabitContext as HabitContextType, initialState } from './types';
import { habitReducer } from './habitReducer';
import { eventManager } from '@/lib/events/EventManager';
import { ActiveTemplate, DayOfWeek } from '@/components/habits/types';
import { logger } from '@/utils/logManager';
import { EventType } from '@/types/events';

// Create the context
const HabitContext = createContext<HabitContextType>({} as HabitContextType);

// Provider component
export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(habitReducer, initialState);

  // Load templates from localStorage on init
  useEffect(() => {
    try {
      const storedTemplates = localStorage.getItem('habit-templates');
      const storedProgress = localStorage.getItem('habit-progress');
      const storedCustomTemplates = localStorage.getItem('custom-templates');

      if (storedTemplates) {
        dispatch({ type: 'INITIALIZE_TEMPLATES', payload: JSON.parse(storedTemplates) });
      }

      if (storedProgress) {
        dispatch({ type: 'INITIALIZE_PROGRESS', payload: JSON.parse(storedProgress) });
      }

      if (storedCustomTemplates) {
        dispatch({ type: 'INITIALIZE_CUSTOM_TEMPLATES', payload: JSON.parse(storedCustomTemplates) });
      }

      dispatch({ type: 'SET_LOADED', payload: true });
    } catch (error) {
      console.error('Error loading habit data:', error);
    }
  }, []);

  // Actions
  const addTemplate = (template: ActiveTemplate) => {
    dispatch({ type: 'ADD_TEMPLATE', payload: template });
    eventManager.emit('habit:template-add', template);
  };

  const updateTemplate = (templateId: string, updates: Partial<ActiveTemplate>) => {
    dispatch({ 
      type: 'UPDATE_TEMPLATE', 
      payload: { templateId, updates } 
    });
    eventManager.emit('habit:template-update', { templateId, ...updates });
  };

  const removeTemplate = (templateId: string) => {
    dispatch({ type: 'REMOVE_TEMPLATE', payload: templateId });
    eventManager.emit('habit:template-remove', { templateId });
  };

  const updateTemplateOrder = (templates: ActiveTemplate[]) => {
    dispatch({ type: 'UPDATE_TEMPLATE_ORDER', payload: templates });
  };

  const updateTemplateDays = (templateId: string, days: DayOfWeek[]) => {
    dispatch({ 
      type: 'UPDATE_TEMPLATE_DAYS', 
      payload: { templateId, days } 
    });
    eventManager.emit('habit:template-days-update', { templateId, days });
  };

  const addCustomTemplate = (template: any) => {
    dispatch({ type: 'ADD_CUSTOM_TEMPLATE', payload: template });
  };

  const removeCustomTemplate = (templateId: string) => {
    dispatch({ type: 'REMOVE_CUSTOM_TEMPLATE', payload: templateId });
  };
  
  const reorderTemplates = (templates: ActiveTemplate[]) => {
    dispatch({ type: 'UPDATE_TEMPLATE_ORDER', payload: templates });
  };
  
  const findTemplateById = (templateId: string) => {
    return state.templates.find(t => t.templateId === templateId);
  };
  
  const reloadTemplates = () => {
    dispatch({ type: 'RELOAD_TEMPLATES' });
  };

  // Save to localStorage on state change
  useEffect(() => {
    if (state.isLoaded) {
      localStorage.setItem('habit-templates', JSON.stringify(state.templates));
      localStorage.setItem('habit-progress', JSON.stringify(state.progress));
      localStorage.setItem('custom-templates', JSON.stringify(state.customTemplates));
    }
  }, [state.templates, state.progress, state.customTemplates, state.isLoaded]);

  // Combine state and actions
  const contextValue: HabitContextType = {
    ...state,
    addTemplate,
    updateTemplate,
    removeTemplate,
    updateTemplateOrder,
    updateTemplateDays,
    addCustomTemplate,
    removeCustomTemplate,
    reorderTemplates,
    findTemplateById,
    reloadTemplates
  };

  return (
    <HabitContext.Provider value={contextValue}>
      {children}
    </HabitContext.Provider>
  );
};

// Custom hook to use the habit context
export const useHabitContext = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabitContext must be used within a HabitProvider');
  }
  return context;
};

// Separate hooks for state and actions
export const useHabitState = () => {
  const { 
    templates, 
    todaysHabits, 
    progress, 
    customTemplates, 
    isLoaded 
  } = useHabitContext();
  
  return { 
    templates, 
    todaysHabits, 
    progress, 
    customTemplates, 
    isLoaded 
  };
};

export const useHabitActions = () => {
  const { 
    addTemplate,
    updateTemplate,
    removeTemplate,
    updateTemplateOrder,
    updateTemplateDays,
    addCustomTemplate,
    removeCustomTemplate,
    reorderTemplates,
    findTemplateById,
    reloadTemplates
  } = useHabitContext();
  
  return {
    addTemplate,
    updateTemplate,
    removeTemplate,
    updateTemplateOrder,
    updateTemplateDays,
    addCustomTemplate,
    removeCustomTemplate,
    reorderTemplates,
    findTemplateById,
    reloadTemplates
  };
};
