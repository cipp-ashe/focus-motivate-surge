
import { toast } from 'sonner';
import { eventManager } from '@/lib/events/EventManager';
import { ActiveTemplate } from '@/components/habits/types';

export const useTemplateEventHandlers = (
  templates: ActiveTemplate[],
  dispatch: React.Dispatch<any>
) => {
  // Handle template update
  const handleTemplateUpdate = (template: any) => {
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
    } else {
      // If no templateId, this is a new template
      const newTemplate = {
        ...template,
        templateId: crypto.randomUUID(),
        customized: false,
      };
      dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
      const updatedTemplates = [...templates, newTemplate];
      localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
      
      if (template.suppressToast !== true) {
        toast.success('Template added successfully');
      }
    }
  };

  // Handle template delete - modified to handle originating action
  const handleTemplateDelete = (data: { 
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
  };

  // Handle template order update
  const handleTemplateOrderUpdate = (templates: ActiveTemplate[]) => {
    console.log("Event received: habit:template-order-update", templates);
    dispatch({ type: 'UPDATE_TEMPLATE_ORDER', payload: templates });
    localStorage.setItem('habit-templates', JSON.stringify(templates));
  };

  // Handle custom template deletion
  const handleCustomTemplateDelete = (data: { 
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
  };

  return {
    handleTemplateUpdate,
    handleTemplateDelete,
    handleTemplateOrderUpdate,
    handleCustomTemplateDelete
  };
};
