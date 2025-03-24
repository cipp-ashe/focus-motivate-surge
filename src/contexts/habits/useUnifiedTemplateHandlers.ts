
import { useCallback } from 'react';
import { toast } from 'sonner';
import { eventManager } from '@/lib/events/EventManager';
import { ActiveTemplate } from '@/types/habits/types';

/**
 * Unified hook for template event handlers
 * 
 * This consolidates all template-related event handling in one place
 */
export const useUnifiedTemplateHandlers = (
  templates: ActiveTemplate[],
  dispatch: React.Dispatch<any>
) => {
  // Add a template
  const addTemplate = useCallback((template: Partial<ActiveTemplate> & { templateId: string }) => {
    console.log("Adding template:", template);
    
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
  const updateTemplate = useCallback((template: any) => {
    console.log("Updating template:", template);
    
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
  const deleteTemplate = useCallback((data: { 
    templateId: string; 
    isOriginatingAction?: boolean;
  }) => {
    console.log("Deleting template:", data.templateId);
    
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
  const updateTemplateOrder = useCallback((templates: ActiveTemplate[]) => {
    console.log("Updating template order");
    dispatch({ type: 'UPDATE_TEMPLATE_ORDER', payload: templates });
    localStorage.setItem('habit-templates', JSON.stringify(templates));
  }, [dispatch]);

  // Update template days
  const updateTemplateDays = useCallback((payload: { templateId: string; activeDays: string[] }) => {
    console.log("Updating template days for", payload.templateId);
    
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
  const deleteCustomTemplate = useCallback((data: { 
    templateId: string;
    suppressToast?: boolean;
  }) => {
    console.log("Deleting custom template:", data.templateId);
    dispatch({ type: 'REMOVE_CUSTOM_TEMPLATE', payload: data.templateId });
    
    // Fixed: Use templateId instead of id
    const updatedTemplates = templates.filter(t => t.templateId !== data.templateId);
    localStorage.setItem('custom-templates', JSON.stringify(updatedTemplates));
    
    // Only show toast if not suppressed
    if (data.suppressToast !== true) {
      toast.success('Custom template deleted');
    }
  }, [templates, dispatch]);

  // Handle all template-related events
  const setupEventListeners = useCallback(() => {
    // Register event handlers
    eventManager.on('habit:template-add', addTemplate);
    eventManager.on('habit:template-update', updateTemplate);
    eventManager.on('habit:template-delete', deleteTemplate);
    eventManager.on('habit:template-order-update', updateTemplateOrder);
    eventManager.on('habit:template-days-update', updateTemplateDays);
    eventManager.on('habit:custom-template-delete', deleteCustomTemplate);
    
    // Return cleanup function
    return () => {
      eventManager.off('habit:template-add', addTemplate);
      eventManager.off('habit:template-update', updateTemplate);
      eventManager.off('habit:template-delete', deleteTemplate);
      eventManager.off('habit:template-order-update', updateTemplateOrder);
      eventManager.off('habit:template-days-update', updateTemplateDays);
      eventManager.off('habit:custom-template-delete', deleteCustomTemplate);
    };
  }, [addTemplate, updateTemplate, deleteTemplate, updateTemplateOrder, updateTemplateDays, deleteCustomTemplate]);

  return {
    addTemplate,
    updateTemplate,
    deleteTemplate,
    updateTemplateOrder,
    updateTemplateDays,
    deleteCustomTemplate,
    setupEventListeners
  };
};
