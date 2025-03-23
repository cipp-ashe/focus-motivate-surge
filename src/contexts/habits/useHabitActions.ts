import { useCallback, useContext } from 'react';
import { HabitContext } from './HabitContext';
import { ActiveTemplate, DayOfWeek, DEFAULT_ACTIVE_DAYS } from '@/components/habits/types';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';

export const useHabitActions = () => {
  const { templates } = useContext(HabitContext);

  const addTemplate = useCallback((template: Omit<ActiveTemplate, 'templateId'>) => {
    const newTemplate: ActiveTemplate = {
      templateId: `template-${Date.now()}`,
      habits: template.habits || [], // Provide a default empty array
      activeDays: template.activeDays || DEFAULT_ACTIVE_DAYS, // Provide default active days
      customized: template.customized,
      name: template.name,
      description: template.description,
      relationships: template.relationships
    };
    
    eventManager.emit('habit:template-add', newTemplate);
    
    if (!newTemplate.suppressToast) {
      toast.success(`Added ${newTemplate.name || 'template'}`);
    }
    
    return newTemplate.templateId;
  }, []);

  const updateTemplate = useCallback((templateId: string, updates: Partial<ActiveTemplate>) => {
    const templateToUpdate = templates.find(t => t.templateId === templateId);
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
    
    eventManager.emit('habit:template-update', updatedTemplate);
    
    if (!updatedTemplate.suppressToast) {
      toast.success(`Updated ${updatedTemplate.name || 'template'}`);
    }
    
    return templateId;
  }, [templates]);

  const removeTemplate = useCallback((templateId: string) => {
    eventManager.emit('habit:template-remove', { templateId });
    toast.success(`Removed template`);
  }, []);

  const updateTemplateOrder = useCallback((templates: ActiveTemplate[]) => {
    eventManager.emit('habit:template-order-update', templates);
  }, []);

  const updateTemplateDays = useCallback((templateId: string, days: DayOfWeek[]) => {
    const templateToUpdate = templates.find(t => t.templateId === templateId);
    if (!templateToUpdate) {
      console.error(`Template ${templateId} not found for updating days`);
      return;
    }
    
    const updatedTemplate: ActiveTemplate = {
      ...templateToUpdate,
      activeDays: days,
      habits: templateToUpdate.habits, // Ensure habits is provided
    };
    
    eventManager.emit('habit:template-days-update', updatedTemplate);
    
    return templateId;
  }, [templates]);

  return {
    addTemplate,
    updateTemplate,
    removeTemplate,
    updateTemplateOrder,
    updateTemplateDays,
  };
};
