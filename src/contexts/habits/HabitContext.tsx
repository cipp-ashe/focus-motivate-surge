import React, { createContext, useContext, useState, useReducer, useCallback } from 'react';
import { HabitState, HabitContext, initialState } from './types';
import { habitReducer } from './habitReducer';
import { ActiveTemplate, DayOfWeek, HabitTemplate } from '@/components/habits/types';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { DEFAULT_ACTIVE_DAYS } from '@/components/habits/types';

/**
 * Context for managing habit-related state
 */
const HabitContext = createContext<HabitContext | undefined>(undefined);

/**
 * Provider component for the habit context
 */
export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(habitReducer, initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * Add a new habit template
   */
  const addTemplate = useCallback((template: Omit<ActiveTemplate, 'templateId'>) => {
    const newTemplate: ActiveTemplate = {
      templateId: `template-${Date.now()}`,
      habits: template.habits || [],
      activeDays: template.activeDays || DEFAULT_ACTIVE_DAYS,
      customized: template.customized,
      name: template.name,
      description: template.description,
      relationships: template.relationships
    };
    dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
    eventManager.emit('habit:template-add', newTemplate);
    toast.success(`Added ${newTemplate.name || 'template'}`);
    return newTemplate.templateId;
  }, []);

  /**
   * Update an existing habit template
   */
  const updateTemplate = useCallback((templateId: string, updates: Partial<ActiveTemplate>) => {
    dispatch({ type: 'UPDATE_TEMPLATE', payload: { templateId, updates } });
    eventManager.emit('habit:template-update', { templateId, updates });
    toast.success(`Updated template ${templateId}`);
  }, []);

  /**
   * Remove a habit template
   */
  const removeTemplate = useCallback((templateId: string) => {
    dispatch({ type: 'REMOVE_TEMPLATE', payload: templateId });
    eventManager.emit('habit:template-remove', { templateId });
    toast.success(`Removed template ${templateId}`);
  }, []);

  /**
   * Update the order of habit templates
   */
  const updateTemplateOrder = useCallback((templates: ActiveTemplate[]) => {
    dispatch({ type: 'UPDATE_TEMPLATE_ORDER', payload: templates });
    eventManager.emit('habit:template-order-update', templates);
  }, []);

  /**
   * Update the active days for a habit template
   */
  const updateTemplateDays = useCallback((templateId: string, days: DayOfWeek[]) => {
    dispatch({ type: 'UPDATE_TEMPLATE_DAYS', payload: { templateId, days } });
    eventManager.emit('habit:template-days-update', { templateId, days });
    toast.success(`Updated days for template ${templateId}`);
  }, []);

  /**
   * Add a new custom habit template
   */
  const addCustomTemplate = useCallback((template: Omit<HabitTemplate, 'id'>) => {
    // Implementation for adding a custom template
  }, []);

  /**
   * Remove a custom habit template
   */
  const removeCustomTemplate = useCallback((templateId: string) => {
    // Implementation for removing a custom template
  }, []);

  /**
   * Reorder templates
   */
  const reorderTemplates = useCallback((templates: ActiveTemplate[]) => {
    dispatch({ type: 'UPDATE_TEMPLATE_ORDER', payload: templates });
  }, []);

  /**
   * Find a template by its ID
   */
  const findTemplateById = useCallback((templateId: string) => {
    const templates = state.templates;
    const templateIndex = templates.findIndex(t => t.templateId === templateId);
    if (templateIndex === -1) return undefined;
    return templates[templateIndex];
  }, [state.templates]);

  /**
   * Reload templates
   */
  const reloadTemplates = useCallback(() => {
    // Implementation for reloading templates
  }, []);

  // Provide the context value
  const contextValue: HabitContext = {
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
    reloadTemplates,
  };

  return (
    <HabitContext.Provider value={contextValue}>
      {children}
    </HabitContext.Provider>
  );
};

/**
 * Hook for using the habit context
 */
export const useHabitContext = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabitContext must be used within a HabitProvider');
  }
  return context;
};
