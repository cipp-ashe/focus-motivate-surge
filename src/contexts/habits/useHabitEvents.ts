
import { useEffect } from 'react';
import { toast } from 'sonner';
import { ActiveTemplate, HabitTemplate } from '@/components/habits/types';
import { eventBus } from '@/lib/eventBus';
import { habitTemplates } from '@/utils/habitTemplates';
import { HabitState } from './types';

// This hook handles all the event subscriptions for the habit context
export const useHabitEvents = (
  state: HabitState,
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
          
          // Save to localStorage
          const updatedTemplates = state.templates.map(t => 
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
      
      // Listen for template order updates
      eventBus.on('habit:template-order-update', (templates) => {
        console.log("Event received: habit:template-order-update", templates);
        dispatch({ type: 'UPDATE_TEMPLATE_ORDER', payload: templates });
        localStorage.setItem('habit-templates', JSON.stringify(templates));
      }),
      
      // Listen for custom template deletion
      eventBus.on('habit:custom-template-delete', ({ templateId }) => {
        console.log("Event received: habit:custom-template-delete", templateId);
        dispatch({ type: 'REMOVE_CUSTOM_TEMPLATE', payload: templateId });
        const updatedTemplates = state.customTemplates.filter(t => t.id !== templateId);
        localStorage.setItem('custom-templates', JSON.stringify(updatedTemplates));
      }),
      
      // Listen for journal creation events to potentially mark habits as complete
      eventBus.on('note:create-from-habit', ({ habitId, templateId }) => {
        console.log("Event received: note:create-from-habit", { habitId, templateId });
        
        if (templateId) {
          // We already have the templateId, so we can immediately mark it as completed
          console.log(`Marking habit ${habitId} in template ${templateId} as completed via event`);
          
          // Note: We don't need to dispatch an action here because the habit progress
          // is tracked separately from the template state
        } else {
          // If no templateId provided, find which template contains this habit
          const template = state.templates.find(t => t.habits.some(h => h.id === habitId));
          if (template) {
            console.log(`Marking habit ${habitId} in template ${template.templateId} as completed via event lookup`);
            // As above, progress tracking is separate
          } else {
            console.warn(`Could not find template for habit ${habitId} to mark as complete`);
          }
        }
      }),
      
      // Listen for custom template updates via localStorage
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
  }, [state, dispatch]);
};
