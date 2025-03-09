
import { toast } from 'sonner';
import { eventBus } from '@/lib/eventBus';
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
      toast.success('Template updated successfully');
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
      toast.success('Template added successfully');
    }
  };

  // Handle template delete
  const handleTemplateDelete = ({ templateId }: { templateId: string }) => {
    console.log("Event received: habit:template-delete", templateId);
    dispatch({ type: 'REMOVE_TEMPLATE', payload: templateId });
    const updatedTemplates = templates.filter(t => t.templateId !== templateId);
    localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
    toast.success('Template deleted successfully');
  };

  // Handle template order update
  const handleTemplateOrderUpdate = (templates: ActiveTemplate[]) => {
    console.log("Event received: habit:template-order-update", templates);
    dispatch({ type: 'UPDATE_TEMPLATE_ORDER', payload: templates });
    localStorage.setItem('habit-templates', JSON.stringify(templates));
  };

  // Handle custom template deletion
  const handleCustomTemplateDelete = ({ templateId }: { templateId: string }) => {
    console.log("Event received: habit:custom-template-delete", templateId);
    dispatch({ type: 'REMOVE_CUSTOM_TEMPLATE', payload: templateId });
    // Fixed: Use templateId instead of id
    const updatedTemplates = templates.filter(t => t.templateId !== templateId);
    localStorage.setItem('custom-templates', JSON.stringify(updatedTemplates));
  };

  return {
    handleTemplateUpdate,
    handleTemplateDelete,
    handleTemplateOrderUpdate,
    handleCustomTemplateDelete
  };
};
