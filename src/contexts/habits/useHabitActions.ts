
import { toast } from 'sonner';
import { ActiveTemplate, DayOfWeek, HabitTemplate } from '@/components/habits/types';
import { HabitContextActions } from './types';

export const useHabitActions = (
  state: { templates: ActiveTemplate[] },
  dispatch: React.Dispatch<any>
): HabitContextActions => {
  return {
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
    
    addCustomTemplate: (template) => {
      const newTemplate: HabitTemplate = {
        ...template,
        id: `custom-${Date.now()}`,
      };
      
      dispatch({ type: 'ADD_CUSTOM_TEMPLATE', payload: newTemplate });
      
      const updatedTemplates = [...state.customTemplates, newTemplate];
      localStorage.setItem('custom-templates', JSON.stringify(updatedTemplates));
      toast.success('Custom template added successfully');
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('templatesUpdated'));
    },
    
    removeCustomTemplate: (templateId) => {
      dispatch({ type: 'REMOVE_CUSTOM_TEMPLATE', payload: templateId });
      
      const updatedTemplates = state.customTemplates.filter(t => t.id !== templateId);
      localStorage.setItem('custom-templates', JSON.stringify(updatedTemplates));
      toast.success('Custom template removed successfully');
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('templatesUpdated'));
    }
  };
};
