
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { ActiveTemplate, DayOfWeek, HabitTemplate, DEFAULT_ACTIVE_DAYS } from '@/components/habits/types';
import { eventManager } from '@/lib/events/EventManager';

const STORAGE_KEY = 'habit-templates';

/**
 * Unified hook for habit template management and events
 */
export const useHabitManagement = () => {
  const [activeTemplates, setActiveTemplates] = useState<ActiveTemplate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Save templates to localStorage when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activeTemplates));
    // Dispatch event when templates are updated
    window.dispatchEvent(new Event('templatesUpdated'));
  }, [activeTemplates]);

  // Template management functions
  const addTemplate = useCallback((template: HabitTemplate | ActiveTemplate) => {
    setActiveTemplates(prev => {
      // Handle predefined template (HabitTemplate)
      if ('id' in template && 'defaultHabits' in template) {
        const exists = prev.some(t => t.templateId === template.id);
        if (exists) {
          toast.error('Template already exists');
          return prev;
        }
        
        const newTemplate: ActiveTemplate = {
          templateId: template.id,
          name: template.name,
          description: template.description,
          habits: template.defaultHabits,
          activeDays: template.defaultDays || DEFAULT_ACTIVE_DAYS,
          customized: false,
          relationships: {} // Add empty relationships object
        };
        
        toast.success('Template added successfully');
        
        // Emit event for template addition using eventManager
        eventManager.emit('habit:template-update', newTemplate);
        
        return [...prev, newTemplate];
      }
      
      // Handle custom template (ActiveTemplate)
      const exists = prev.some(t => t.templateId === template.templateId);
      if (exists) {
        toast.error('Template already exists');
        return prev;
      }
      
      toast.success('Template added successfully');
      
      // Emit event for template addition using eventManager
      eventManager.emit('habit:template-update', template);
      
      // Trigger UI update
      setTimeout(() => {
        window.dispatchEvent(new Event('force-habits-update'));
      }, 100);
      
      return [...prev, template];
    });
  }, []);

  const updateTemplate = useCallback((templateId: string, updates: Partial<ActiveTemplate>) => {
    setActiveTemplates(prev => {
      const updated = prev.map(template =>
        template.templateId === templateId
          ? { ...template, ...updates, customized: true }
          : template
      );
      
      // Emit event for template update using eventManager
      const updatedTemplate = updated.find(t => t.templateId === templateId);
      if (updatedTemplate) {
        eventManager.emit('habit:template-update', updatedTemplate);
      }
      
      return updated;
    });
  }, []);

  const removeTemplate = useCallback((templateId: string) => {
    setActiveTemplates(prev => 
      prev.filter(template => template.templateId !== templateId)
    );
    
    // Emit event for template deletion using eventManager
    eventManager.emit('habit:template-delete', { templateId, isOriginatingAction: true });
    
    toast.success('Template removed');
  }, []);

  const updateTemplateOrder = useCallback((templates: ActiveTemplate[]) => {
    setActiveTemplates(templates);
    
    // Emit event for order update using eventManager
    eventManager.emit('habit:template-order-update', templates);
  }, []);

  const updateTemplateDays = useCallback((templateId: string, days: DayOfWeek[]) => {
    setActiveTemplates(prev => {
      const updated = prev.map(template =>
        template.templateId === templateId
          ? { ...template, activeDays: days, customized: true }
          : template
      );
      
      // Emit event for days update using eventManager
      const updatedTemplate = updated.find(t => t.templateId === templateId);
      if (updatedTemplate) {
        eventManager.emit('habit:template-update', updatedTemplate);
      }
      
      return updated;
    });
  }, []);

  // Habit event functions
  const completeHabit = useCallback((habitId: string, date: string, value: boolean | number = true) => {
    // Fix payload structure to match expected type
    eventManager.emit('habit:complete', {
      habitId,
      date,
      value
    });
  }, []);

  const checkPendingHabits = useCallback(() => {
    eventManager.emit('habits:check-pending', {});
  }, []);

  const scheduleHabitTask = useCallback((
    habitId: string,
    templateId: string,
    name: string,
    duration: number,
    date: string,
    metricType?: string
  ) => {
    eventManager.emit('habit:schedule', {
      habitId,
      templateId,
      name,
      duration,
      date,
      metricType
    });
  }, []);

  // Use type assertion for additional properties
  const openHabitJournal = useCallback((habitId: string, habitName: string, description?: string, templateId?: string) => {
    eventManager.emit('journal:open', {
      habitId,
      habitName,
      description,
      templateId
    } as any);
  }, []);

  return {
    // Template state
    activeTemplates,
    
    // Template management functions
    addTemplate,
    updateTemplate,
    removeTemplate,
    updateTemplateOrder,
    updateTemplateDays,
    
    // Habit event functions
    completeHabit,
    checkPendingHabits,
    scheduleHabitTask,
    openHabitJournal
  };
};
