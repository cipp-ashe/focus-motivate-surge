
import { useEffect, useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { HabitCompletionEvent, TemplateUpdateEvent } from '@/types/habits/unified';

/**
 * Hook for subscribing to habit-related events
 */
export const useHabitEvents = () => {
  const onHabitComplete = useCallback((callback: (data: HabitCompletionEvent) => void) => {
    return eventManager.on('habit:complete', callback);
  }, []);

  const onHabitDismiss = useCallback((callback: (data: { habitId: string, date: string }) => void) => {
    return eventManager.on('habit:dismiss', callback);
  }, []);

  const onTemplateUpdate = useCallback((callback: (data: TemplateUpdateEvent) => void) => {
    return eventManager.on('habit:template-update', callback);
  }, []);

  const onTemplateAdd = useCallback((callback: (data: any) => void) => {
    return eventManager.on('habit:template-add', callback);
  }, []);

  const onTemplateDelete = useCallback((callback: (data: { templateId: string }) => void) => {
    return eventManager.on('habit:template-delete', callback);
  }, []);

  const onTemplateDaysUpdate = useCallback((callback: (data: { templateId: string, activeDays: string[] }) => void) => {
    return eventManager.on('habit:template-days-update', callback);
  }, []);

  return {
    onHabitComplete,
    onHabitDismiss,
    onTemplateUpdate,
    onTemplateAdd,
    onTemplateDelete,
    onTemplateDaysUpdate,
    emit: eventManager.emit
  };
};
