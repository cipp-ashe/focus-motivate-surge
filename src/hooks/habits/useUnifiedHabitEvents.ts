
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { MetricType, DayOfWeek, ActiveTemplate } from '@/types/habits/types';
import { EventPayload } from '@/types/events';

/**
 * Unified hook for habit events
 * 
 * This hook provides a comprehensive API for all habit-related events
 */
export const useUnifiedHabitEvents = () => {
  // Complete a habit
  const completeHabit = useCallback((habitId: string, date: string, value: boolean | number = true, metricType?: MetricType, habitName?: string, templateId?: string) => {
    eventManager.emit('habit:complete', {
      habitId,
      date,
      value,
      metricType,
      habitName,
      templateId
    });
  }, []);

  // Dismiss a habit
  const dismissHabit = useCallback((habitId: string, date: string) => {
    eventManager.emit('habit:dismiss', {
      habitId,
      date
    });
  }, []);

  // Trigger habit tasks check
  const checkPendingHabits = useCallback(() => {
    eventManager.emit('habits:check-pending', {});
  }, []);

  // Schedule a habit task
  const scheduleHabitTask = useCallback((
    habitId: string,
    templateId: string,
    name: string,
    duration: number,
    date: string,
    metricType?: MetricType
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

  // Template management events
  const updateHabitTemplate = useCallback((templateData: Partial<ActiveTemplate> & { templateId: string }) => {
    eventManager.emit('habit:template-update', templateData);
  }, []);

  const deleteHabitTemplate = useCallback((templateId: string, isOriginatingAction: boolean = true) => {
    eventManager.emit('habit:template-delete', {
      templateId,
      isOriginatingAction
    });
  }, []);

  const addHabitTemplate = useCallback((template: Partial<ActiveTemplate> & { templateId: string }) => {
    eventManager.emit('habit:template-add', template);
  }, []);
  
  const updateTemplateDays = useCallback((templateId: string, days: DayOfWeek[]) => {
    eventManager.emit('habit:template-days-update', {
      templateId,
      activeDays: days
    });
  }, []);
  
  const updateTemplateOrder = useCallback((templates: ActiveTemplate[]) => {
    eventManager.emit('habit:template-order-update', templates);
  }, []);

  // Journal integration
  const openHabitJournal = useCallback((habitId: string, habitName: string, description?: string, templateId?: string, date?: string) => {
    eventManager.emit('journal:open', {
      habitId,
      habitName,
      description,
      templateId,
      date: date || new Date().toISOString()
    });
  }, []);

  // Note/Journal creation
  const createHabitNote = useCallback((habitId: string, habitName: string, content: string, templateId?: string) => {
    eventManager.emit('habit:note-create', {
      habitId,
      habitName,
      content,
      templateId
    });
  }, []);

  const createHabitJournal = useCallback((habitId: string, habitName: string, content: string, templateId?: string, date?: string) => {
    eventManager.emit('habit:journal-create', {
      habitId,
      habitName,
      content,
      templateId,
      date: date || new Date().toISOString()
    });
  }, []);

  // Sync habits with tasks
  const syncHabitsWithTasks = useCallback(() => {
    console.log('Syncing habits with tasks');
    eventManager.emit('habits:check-pending', {});
  }, []);

  return {
    // Habit actions
    completeHabit,
    dismissHabit,
    checkPendingHabits,
    scheduleHabitTask,
    
    // Template management
    updateHabitTemplate,
    deleteHabitTemplate,
    addHabitTemplate,
    updateTemplateDays,
    updateTemplateOrder,
    
    // Journal/Note integration
    openHabitJournal,
    createHabitNote,
    createHabitJournal,
    
    // Task integration
    syncHabitsWithTasks
  };
};
