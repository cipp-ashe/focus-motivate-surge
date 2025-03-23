
import { useCallback } from 'react';
import { useHabitContext } from './HabitContext';
import { ActiveTemplate, DayOfWeek, DEFAULT_ACTIVE_DAYS } from '@/components/habits/types';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { EventType } from '@/types/events';

export const useHabitActions = () => {
  const context = useHabitContext();

  const addTemplate = useCallback((template: Omit<ActiveTemplate, 'templateId'>) => {
    const newTemplate: ActiveTemplate = {
      templateId: `template-${Date.now()}`,
      habits: template.habits || [], // Provide a default empty array
      activeDays: template.activeDays || DEFAULT_ACTIVE_DAYS, // Provide default active days
      customized: template.customized,
      name: template.name,
      description: template.description,
    };
    
    eventManager.emit('habit:template-add' as EventType, newTemplate);
    
    if (!newTemplate.suppressToast) {
      toast.success(`Added ${newTemplate.name || 'template'}`);
    }
    
    return newTemplate.templateId;
  }, []);

  const updateTemplate = useCallback((templateId: string, updates: Partial<ActiveTemplate>) => {
    const templateToUpdate = context.templates.find(t => t.templateId === templateId);
    if (!templateToUpdate) {
      console.error(`Template ${templateId} not found for updating`);
      return;
    }

    const updatedTemplate: ActiveTemplate = {
      ...templateToUpdate,
      ...updates,
      habits: updates.habits !== undefined ? updates.habits : templateToUpdate.habits,
      activeDays: updates.activeDays !== undefined ? updates.activeDays : templateToUpdate.activeDays,
    };
    
    eventManager.emit('habit:template-update' as EventType, updatedTemplate);
    
    if (!updatedTemplate.suppressToast) {
      toast.success(`Updated ${updatedTemplate.name || 'template'}`);
    }
    
    return templateId;
  }, [context.templates]);

  const removeTemplate = useCallback((templateId: string) => {
    eventManager.emit('habit:template-remove' as EventType, { templateId });
    toast.success(`Removed template`);
  }, []);

  const updateTemplateOrder = useCallback((templates: ActiveTemplate[]) => {
    eventManager.emit('habit:template-order-update' as EventType, templates);
  }, []);

  const updateTemplateDays = useCallback((templateId: string, days: DayOfWeek[]) => {
    const templateToUpdate = context.templates.find(t => t.templateId === templateId);
    if (!templateToUpdate) {
      console.error(`Template ${templateId} not found for updating days`);
      return;
    }
    
    const updatedTemplate: ActiveTemplate = {
      ...templateToUpdate,
      activeDays: days,
      habits: templateToUpdate.habits, // Ensure habits is provided
    };
    
    eventManager.emit('habit:template-days-update' as EventType, updatedTemplate);
    
    return templateId;
  }, [context.templates]);

  return {
    addTemplate,
    updateTemplate,
    removeTemplate,
    updateTemplateOrder,
    updateTemplateDays,
  };
};
