import { useCallback } from 'react';
import { DayOfWeek, ActiveTemplate } from '@/components/habits/types';
import { eventBus } from '@/lib/eventBus';
import { HabitContextActions } from './types';

export const createHabitActions = (
  state: any,
  dispatch: React.Dispatch<any>
): HabitContextActions => {
  const addTemplate = useCallback((template: ActiveTemplate) => {
    console.log("Adding template:", template);
    dispatch({ type: 'ADD_TEMPLATE', payload: template });
  }, [dispatch]);

  const updateTemplate = useCallback((templateId: string, updates: Partial<ActiveTemplate>) => {
    console.log("Updating template:", templateId, updates);
    
    // Emit event to update template
    eventBus.emit('habit:template-update', { 
      templateId, 
      ...updates 
    });
    
    // Update state through reducer
    dispatch({ 
      type: 'UPDATE_TEMPLATE', 
      payload: { templateId, updates } 
    });
  }, [dispatch]);

  const removeTemplate = useCallback((templateId: string) => {
    console.log("Removing template:", templateId);
    
    // Use the event bus to handle the deletion
    // This is the originating action, so we set isOriginatingAction to true
    eventBus.emit('habit:template-delete', { 
      templateId, 
      isOriginatingAction: true 
    });
  }, []);

  const updateTemplateDays = useCallback((templateId: string, days: DayOfWeek[]) => {
    console.log("Updating template days:", templateId, days);
    
    // Emit event to update template days via the event bus
    eventBus.emit('habit:template-update', { 
      templateId, 
      activeDays: days 
    });
    
    // Update state through reducer
    dispatch({ 
      type: 'UPDATE_TEMPLATE_DAYS', 
      payload: { templateId, days } 
    });
  }, [dispatch]);

  // Renamed to match the interface - this used to be reorderTemplates
  const updateTemplateOrder = useCallback((templates: ActiveTemplate[]) => {
    console.log("Reordering templates");
    
    // Use the event bus to handle template order updates
    eventBus.emit('habit:template-order-update', templates);
    
    // Also update state through reducer
    dispatch({ 
      type: 'UPDATE_TEMPLATE_ORDER', 
      payload: templates 
    });
  }, [dispatch]);

  // Keep reorderTemplates for backward compatibility
  const reorderTemplates = useCallback((templates: ActiveTemplate[]) => {
    console.log("Reordering templates (calling updateTemplateOrder)");
    updateTemplateOrder(templates);
  }, [updateTemplateOrder]);

  const findTemplateById = useCallback((templateId: string) => {
    return state.templates.find((t: ActiveTemplate) => t.templateId === templateId);
  }, [state.templates]);

  const reloadTemplates = useCallback(() => {
    console.log("Reloading templates - this should be implemented in the HabitProvider");
    // This is a stub that will be overridden in the HabitProvider
  }, []);

  // Add stub implementations for the missing methods to satisfy the interface
  const addCustomTemplate = useCallback((template: Omit<any, 'id'>) => {
    console.log("Adding custom template - this should be implemented in the HabitProvider");
    // Stub implementation
  }, []);

  const removeCustomTemplate = useCallback((templateId: string) => {
    console.log("Removing custom template - this should be implemented in the HabitProvider");
    // Stub implementation
  }, []);

  return {
    addTemplate,
    updateTemplate,
    removeTemplate,
    updateTemplateDays,
    updateTemplateOrder,
    reorderTemplates,
    findTemplateById,
    reloadTemplates,
    addCustomTemplate,
    removeCustomTemplate
  };
};
