
import { useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { ActiveTemplate } from '@/components/habits/types';

/**
 * Hook to set up event handlers for habit templates
 */
export const useHabitEvents = (templates: ActiveTemplate[]) => {
  // Set up event handlers
  useEffect(() => {
    // Template update handler
    const handleTemplateUpdate = (template: any) => {
      console.log('Habit template updated:', template);
    };
    
    // Template delete handler
    const handleTemplateDelete = ({ templateId }: { templateId: string }) => {
      console.log('Habit template deleted:', templateId);
    };
    
    // Subscribe to events
    const unsubUpdate = eventManager.on('habit:template-update', handleTemplateUpdate);
    const unsubDelete = eventManager.on('habit:template-delete', handleTemplateDelete);
    
    // Cleanup on unmount
    return () => {
      unsubUpdate();
      unsubDelete();
    };
  }, [templates]);
  
  return {};
};
