
import { useEffect } from 'react';
import { toast } from 'sonner';
import { ActiveTemplate, HabitTemplate } from '@/components/habits/types';
import { eventBus } from '@/lib/eventBus';
import { habitTemplates } from '@/utils/habitTemplates';

// This hook handles all the event subscriptions for the habit context
export const useHabitEvents = (
  state: { templates: ActiveTemplate[]; customTemplates: HabitTemplate[] },
  dispatch: React.Dispatch<any>
) => {
  useEffect(() => {
    // Subscribe to template events
    const unsubscribers = [
      eventBus.on('habit:template-update', (template) => {
        console.log("Event received: habit:template-update", template);
        if (template.templateId) {
          dispatch({ 
            type: 'UPDATE_TEMPLATE', 
            payload: { templateId: template.templateId, updates: template } 
          });
          localStorage.setItem('habit-templates', JSON.stringify(state.templates));
          toast.success('Template updated successfully');
        } else {
          // If no templateId, this is a new template
          const newTemplate = {
            ...template,
            templateId: crypto.randomUUID(),
            customized: false,
          };
          dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
          const updatedTemplates = [...state.templates, newTemplate];
          localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
          toast.success('Template added successfully');
        }
      }),
      
      eventBus.on('habit:template-delete', ({ templateId }) => {
        console.log("Event received: habit:template-delete", templateId);
        dispatch({ type: 'REMOVE_TEMPLATE', payload: templateId });
        const updatedTemplates = state.templates.filter(t => t.templateId !== templateId);
        localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
        toast.success('Template deleted successfully');
      }),
      
      // Listen for template add events
      eventBus.on('habit:template-add', (templateId) => {
        console.log("Event received: habit:template-add", templateId);
        // Find template in predefined templates or custom templates
        const template = habitTemplates.find(t => t.id === templateId);
        if (template) {
          const newTemplate: ActiveTemplate = {
            templateId: template.id,
            habits: template.defaultHabits,
            activeDays: template.defaultDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            customized: false,
          };
          dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
          const updatedTemplates = [...state.templates, newTemplate];
          localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
          toast.success(`Template added: ${template.name}`);
        } else {
          // Check for custom template
          const customTemplatesStr = localStorage.getItem('custom-templates');
          if (customTemplatesStr) {
            const customTemplates = JSON.parse(customTemplatesStr);
            const customTemplate = customTemplates.find(t => t.id === templateId);
            if (customTemplate) {
              const newTemplate: ActiveTemplate = {
                templateId: customTemplate.id,
                habits: customTemplate.defaultHabits,
                activeDays: customTemplate.defaultDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                customized: false,
              };
              dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
              const updatedTemplates = [...state.templates, newTemplate];
              localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
              toast.success(`Custom template added: ${customTemplate.name}`);
            } else {
              toast.error(`Template not found: ${templateId}`);
            }
          } else {
            toast.error(`Template not found: ${templateId}`);
          }
        }
      }),
      
      // Listen for custom template updates
      window.addEventListener('templatesUpdated', () => {
        try {
          const customTemplates = JSON.parse(localStorage.getItem('custom-templates') || '[]');
          dispatch({ type: 'LOAD_CUSTOM_TEMPLATES', payload: customTemplates });
        } catch (error) {
          console.error('Error loading custom templates:', error);
        }
      })
    ];

    return () => {
      unsubscribers.forEach(unsub => typeof unsub === 'function' && unsub());
      window.removeEventListener('templatesUpdated', () => {});
    };
  }, [state.templates, dispatch]);
};
