
import { toast } from 'sonner';
import { ActiveTemplate, DayOfWeek, HabitTemplate } from '@/components/habits/types';
import { HabitContextActions, HabitState } from './types';
import { eventBus } from '@/lib/eventBus';

export const createHabitActions = (
  state: HabitState,
  dispatch: React.Dispatch<any>
): Omit<HabitContextActions, 'reloadTemplates'> => {
  return {
    addTemplate: (template) => {
      // Generate a UUID if no templateId exists
      const templateId = 'templateId' in template ? template.templateId : crypto.randomUUID();
      
      const newTemplate = {
        ...template,
        templateId: templateId,
        customized: false,
      };
      
      dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
      const updatedTemplates = [...state.templates, newTemplate];
      localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
      
      // Emit event for other components to react
      // IMPORTANT: Set suppressToast to true to prevent duplicate toasts
      eventBus.emit('habit:template-update', { ...newTemplate, suppressToast: true });
      
      // Trigger a global UI update
      setTimeout(() => {
        window.dispatchEvent(new Event('force-habits-update'));
      }, 100);
    },
    
    updateTemplate: (templateId, updates) => {
      dispatch({ type: 'UPDATE_TEMPLATE', payload: { templateId, updates } });
      const updatedTemplates = state.templates.map(template =>
        template.templateId === templateId
          ? { ...template, ...updates, customized: true }
          : template
      );
      localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
      
      // Emit event for template update
      const updatedTemplate = updatedTemplates.find(t => t.templateId === templateId);
      if (updatedTemplate) {
        eventBus.emit('habit:template-update', { ...updatedTemplate, suppressToast: true });
      }
      toast.success('Template updated successfully');
    },
    
    removeTemplate: (templateId) => {
      // We no longer show the toast here as HabitTracker will handle it
      console.log('HabitActions: Received removeTemplate call', templateId);
      
      // Update the internal state first
      dispatch({ type: 'REMOVE_TEMPLATE', payload: templateId });
      
      // Update localStorage
      const updatedTemplates = state.templates.filter(t => t.templateId !== templateId);
      localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
      
      // We no longer emit the event here as HabitTracker handles it
    },
    
    updateTemplateOrder: (templates) => {
      dispatch({ type: 'UPDATE_TEMPLATE_ORDER', payload: templates });
      localStorage.setItem('habit-templates', JSON.stringify(templates));
      
      // Notify via event bus about order change
      eventBus.emit('habit:template-order-update', templates);
    },
    
    updateTemplateDays: (templateId, days) => {
      dispatch({ type: 'UPDATE_TEMPLATE_DAYS', payload: { templateId, days } });
      const updatedTemplates = state.templates.map(template =>
        template.templateId === templateId
          ? { ...template, activeDays: days, customized: true }
          : template
      );
      localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
      
      // Emit event for template days update
      const updatedTemplate = updatedTemplates.find(t => t.templateId === templateId);
      if (updatedTemplate) {
        eventBus.emit('habit:template-update', { ...updatedTemplate, suppressToast: true });
      }
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
      
      // Emit event for custom template creation with suppressToast
      eventBus.emit('habit:custom-template-create', { ...newTemplate, suppressToast: true });
      toast.success('Custom template added successfully');
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('templatesUpdated'));
    },
    
    removeCustomTemplate: (templateId) => {
      dispatch({ type: 'REMOVE_CUSTOM_TEMPLATE', payload: templateId });
      
      const updatedTemplates = state.customTemplates.filter(t => t.id !== templateId);
      localStorage.setItem('custom-templates', JSON.stringify(updatedTemplates));
      
      // Emit event for custom template deletion
      eventBus.emit('habit:custom-template-delete', { templateId, suppressToast: true });
      toast.success('Custom template removed successfully');
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('templatesUpdated'));
    }
  };
};
