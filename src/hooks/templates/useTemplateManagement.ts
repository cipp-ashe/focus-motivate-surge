
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { useTaskActions } from '@/hooks/tasks/useTaskActions';
import { HabitTemplate, HabitTemplateWithId } from '@/types/habits';
import { DBService } from '@/lib/storage/DBService';
import { useTemplateStorage } from './useTemplateStorage';
import { TaskEventType } from '@/lib/events/types';

/**
 * Custom hook for managing templates with synchronization
 */
export const useTemplateManagement = () => {
  const { forceTaskUpdate } = useTaskActions();
  const { saveCustomTemplate, deleteCustomTemplate, getCustomTemplates } = useTemplateStorage();

  /**
   * Create a new custom template
   */
  const createTemplate = useCallback(async (template: HabitTemplate): Promise<string | null> => {
    try {
      // Generate a new ID for the template
      const id = `custom-${crypto.randomUUID()}`;
      
      // Save to storage
      const templateWithId: HabitTemplateWithId = {
        ...template,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await saveCustomTemplate(templateWithId);
      
      // Save to database if user is authenticated
      try {
        const { data: { user } } = await DBService.getAuthUser();
        if (user) {
          const { error } = await DBService.saveTemplate({
            ...templateWithId,
            user_id: user.id
          });
          
          if (error) {
            console.error('Error saving template to database:', error);
          }
        }
      } catch (dbError) {
        console.error('Database error saving template:', dbError);
      }
      
      // Force task update
      forceTaskUpdate();
      
      return id;
    } catch (error) {
      console.error('Error creating template:', error);
      return null;
    }
  }, [saveCustomTemplate, forceTaskUpdate]);

  /**
   * Delete a template
   */
  const deleteTemplate = useCallback(async (id: string): Promise<boolean> => {
    try {
      if (!id) return false;
      
      console.log(`Deleting template: ${id}`);
      await deleteCustomTemplate(id);
      
      // Also delete from database if user is authenticated
      try {
        const { data: { user } } = await DBService.getAuthUser();
        if (user) {
          const { error } = await DBService.deleteTemplate(id);
          if (error) {
            console.error('Error deleting template from database:', error);
          }
        }
      } catch (dbError) {
        console.error('Database error deleting template:', dbError);
      }
      
      // Emit event for other components
      eventManager.emit('habit:template-delete', { 
        templateId: id,
        isOriginatingAction: true
      });
      
      // Force task update
      eventManager.emit('task:reload' as TaskEventType, {});
      
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      return false;
    }
  }, [deleteCustomTemplate]);

  /**
   * Get all custom templates
   */
  const getAllCustomTemplates = useCallback(async (): Promise<HabitTemplateWithId[]> => {
    try {
      return await getCustomTemplates();
    } catch (error) {
      console.error('Error getting custom templates:', error);
      return [];
    }
  }, [getCustomTemplates]);

  return {
    createTemplate,
    deleteTemplate,
    getAllCustomTemplates
  };
};
