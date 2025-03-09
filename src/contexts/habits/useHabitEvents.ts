import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { ActiveTemplate, HabitTemplate } from '@/components/habits/types';
import { eventBus } from '@/lib/eventBus';
import { habitTemplates } from '@/utils/habitTemplates';
import { HabitState } from './types';
import { relationshipManager } from '@/lib/relationshipManager';

// This hook handles all the event subscriptions for the habit context
export const useHabitEvents = (
  state: HabitState,
  dispatch: React.Dispatch<any>
) => {
  const processingTemplateRef = useRef<string | null>(null);
  const templateProcessTimeouts = useRef(new Map<string, NodeJS.Timeout>());
  
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
      
      // Listen for template add events with improved duplicate detection
      eventBus.on('habit:template-add', (templateId: string) => {
        console.log("Event received: habit:template-add", templateId);
        
        // Clear any existing timeout for this template
        if (templateProcessTimeouts.current.has(templateId)) {
          clearTimeout(templateProcessTimeouts.current.get(templateId)!);
          templateProcessTimeouts.current.delete(templateId);
        }
        
        // Skip duplicate events for the same template
        if (processingTemplateRef.current === templateId) {
          console.log(`Already processing template ${templateId}, skipping duplicate event`);
          return;
        }
        
        // Check if template is already added
        if (state.templates.some(t => t.templateId === templateId)) {
          console.log(`Template ${templateId} already exists in active templates, skipping`);
          return;
        }
        
        // Set processing flag
        processingTemplateRef.current = templateId;
        
        // Use timeout to debounce multiple rapid events for the same template
        const timeout = setTimeout(() => {
          try {
            // Find template in predefined templates or custom templates
            const template = habitTemplates.find(t => t.id === templateId);
            if (template) {
              const newTemplate: ActiveTemplate = {
                templateId: template.id,
                habits: template.defaultHabits,
                activeDays: template.defaultDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                customized: false,
              };
              
              // Add template if it doesn't already exist
              if (!state.templates.some(t => t.templateId === templateId)) {
                dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
                const updatedTemplates = [...state.templates, newTemplate];
                localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
                toast.success(`Template added: ${template.name}`);
              }
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
                  
                  // Only add if not already present
                  if (!state.templates.some(t => t.templateId === templateId)) {
                    dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
                    const updatedTemplates = [...state.templates, newTemplate];
                    localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
                    toast.success(`Custom template added: ${customTemplate.name}`);
                  }
                } else {
                  toast.error(`Template not found: ${templateId}`);
                }
              } else {
                toast.error(`Template not found: ${templateId}`);
              }
            }
          } finally {
            // Clear processing flag after a delay
            setTimeout(() => {
              processingTemplateRef.current = null;
            }, 300);
            
            templateProcessTimeouts.current.delete(templateId);
          }
        }, 50); // Short delay to debounce events
        
        templateProcessTimeouts.current.set(templateId, timeout);
      }),
      
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
        
        if (habitId) {
          // Update habit progress storage directly to ensure it persists
          const progressStorageKey = 'habit-progress';
          const today = new Date().toISOString().split('T')[0];
          
          try {
            const storedProgress = JSON.parse(localStorage.getItem(progressStorageKey) || '{}');
            
            // Find the right template if not provided
            if (!templateId) {
              // Search for the template containing this habit
              const template = state.templates.find(t => 
                t.habits.some(h => h.id === habitId)
              );
              if (template) {
                templateId = template.templateId;
              }
            }
            
            if (templateId) {
              // Create nested structure if it doesn't exist
              const templateData = storedProgress[templateId] || {};
              const habitData = templateData[habitId] || {};
              
              // Mark as completed
              storedProgress[templateId] = {
                ...templateData,
                [habitId]: {
                  ...habitData,
                  [today]: {
                    value: true,
                    streak: (habitData[today]?.streak || 0) + 1,
                    date: today,
                    completed: true
                  }
                }
              };
              
              // Save back to localStorage
              localStorage.setItem(progressStorageKey, JSON.stringify(storedProgress));
              console.log(`Updated progress for habit ${habitId} in template ${templateId} (from event):`, 
                storedProgress[templateId][habitId][today]);
            }
          } catch (error) {
            console.error('Error updating habit progress from journal creation:', error);
          }
        }
      }),
      
      // Listen for journal deletion events
      eventBus.on('habit:journal-deleted', ({ habitId }) => {
        console.log("Event received: habit:journal-deleted", { habitId });
        
        // Check if there are any remaining notes for this habit
        const relatedNotes = relationshipManager.getRelatedEntities(habitId, 'habit', 'note');
        
        // If there are no more notes, mark the habit as uncompleted
        if (relatedNotes.length === 0) {
          // Find which template contains this habit
          let templateId: string | undefined;
          
          for (const template of state.templates) {
            if (template.habits.some(h => h.id === habitId)) {
              templateId = template.templateId;
              break;
            }
          }
          
          if (templateId) {
            const progressStorageKey = 'habit-progress';
            const today = new Date().toISOString().split('T')[0];
            
            try {
              const storedProgress = JSON.parse(localStorage.getItem(progressStorageKey) || '{}');
              
              // Check if we have progress data for this template and habit
              if (storedProgress[templateId]?.[habitId]?.[today]) {
                // Mark as not completed
                storedProgress[templateId][habitId][today] = {
                  ...storedProgress[templateId][habitId][today],
                  value: false,
                  completed: false
                };
                
                // Save back to localStorage
                localStorage.setItem(progressStorageKey, JSON.stringify(storedProgress));
                console.log(`Marked habit ${habitId} as uncompleted after journal deletion`);
              }
            } catch (error) {
              console.error('Error updating habit progress after journal deletion:', error);
            }
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
      // Clear all timeouts on unmount
      templateProcessTimeouts.current.forEach(timeout => clearTimeout(timeout));
      templateProcessTimeouts.current.clear();
      
      unsubscribers.forEach(unsub => typeof unsub === 'function' && unsub());
      window.removeEventListener('templatesUpdated', () => {});
    };
  }, [state, dispatch]);
};
