
import { useCallback } from 'react';
import { toast } from 'sonner';
import { eventManager } from '@/lib/events/EventManager';
import { ActiveTemplate } from '@/types/habits/types';

/**
 * Unified hook for template event handlers
 * 
 * This consolidates functionality from:
 * - useTemplateEventHandlers
 * - useTemplateManagement
 * - useHabitActions (template management section)
 */
export const useUnifiedTemplateHandlers = (
  templates: ActiveTemplate[],
  dispatch: React.Dispatch<any>
) => {
  // Add a template
  const addTemplate = useCallback((template: Partial<ActiveTemplate> & { templateId: string }) => {
    console.log("Event received: habit:template-add", template);
    
    dispatch({ type: 'ADD_TEMPLATE', payload: template });
    
    // Save to localStorage
    const updatedTemplates = [...templates, template];
    localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
    
    // Only show toast if not suppressed
    if (template.suppressToast !== true) {
      toast.success(`Added ${template.name || 'template'}`);
    }
  }, [templates, dispatch]);

  // Update a template
  const handleTemplateUpdate = useCallback((template: any) => {
    console.log("Event received: habit:template-update", template);
    
    if (template.templateId) {
      dispatch({ 
        type: 'UPDATE_TEMPLATE', 
        payload: { templateId: template.templateId, updates: template } 
      });
      
      // Save to localStorage
      const updatedTemplates = templates.map(t => 
        t.templateId === template.templateId ? { ...t, ...template, customized: true } : t
      );
      localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
      
      // Only show toast if not suppressed
      if (template.suppressToast !== true) {
        toast.success('Template updated successfully');
      }
    }
  }, [templates, dispatch]);

  // Delete a template
  const handleTemplateDelete = useCallback((data: { 
    templateId: string; 
    isOriginatingAction?: boolean;
  }) => {
    console.log("Event received: habit:template-delete", data.templateId, {
      isOriginatingAction: data.isOriginatingAction
    });
    
    // Update state via reducer
    dispatch({ type: 'REMOVE_TEMPLATE', payload: data.templateId });
    
    // Update localStorage
    const updatedTemplates = templates.filter(t => t.templateId !== data.templateId);
    localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
    
    // Only show toast if this is the originating action
    if (data.isOriginatingAction) {
      toast.success('Template deleted successfully');
    }
    
    // Always emit follow-up event for task cleanup but suppress toast
    if (data.isOriginatingAction) {
      setTimeout(() => {
        eventManager.emit('habit:template-delete', { 
          templateId: data.templateId,
          isOriginatingAction: false 
        });
      }, 50);
    }
  }, [templates, dispatch]);

  // Update template order
  const handleTemplateOrderUpdate = useCallback((templates: ActiveTemplate[]) => {
    console.log("Event received: habit:template-order-update", templates);
    dispatch({ type: 'UPDATE_TEMPLATE_ORDER', payload: templates });
    localStorage.setItem('habit-templates', JSON.stringify(templates));
  }, [dispatch]);

  // Update template days
  const handleTemplateDaysUpdate = useCallback((payload: { templateId: string; activeDays: string[] }) => {
    console.log("Event received: habit:template-days-update", payload);
    
    const { templateId, activeDays } = payload;
    
    dispatch({ 
      type: 'UPDATE_TEMPLATE', 
      payload: { 
        templateId, 
        updates: { activeDays, customized: true } 
      } 
    });
    
    // Update localStorage
    const updatedTemplates = templates.map(t => 
      t.templateId === templateId 
        ? { ...t, activeDays, customized: true } 
        : t
    );
    localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
    
    toast.success('Template days updated');
  }, [templates, dispatch]);

  // Handle custom template deletion
  const handleCustomTemplateDelete = useCallback((data: { 
    templateId: string;
    suppressToast?: boolean;
  }) => {
    console.log("Event received: habit:custom-template-delete", data.templateId);
    dispatch({ type: 'REMOVE_CUSTOM_TEMPLATE', payload: data.templateId });
    
    // Fixed: Use templateId instead of id
    const updatedTemplates = templates.filter(t => t.templateId !== data.templateId);
    localStorage.setItem('custom-templates', JSON.stringify(updatedTemplates));
    
    // Only show toast if not suppressed
    if (data.suppressToast !== true) {
      toast.success('Custom template deleted');
    }
  }, [templates, dispatch]);

  return {
    addTemplate,
    handleTemplateUpdate,
    handleTemplateDelete,
    handleTemplateOrderUpdate,
    handleTemplateDaysUpdate,
    handleCustomTemplateDelete
  };
};
