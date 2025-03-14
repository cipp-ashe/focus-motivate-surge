
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { ActiveTemplate, HabitDetail } from '@/components/habits/types';
import { migrateHabitTemplate } from '@/lib/migrations/habitTemplates';
import { toast } from 'sonner';

export const useHabitStorage = () => {
  const [templates, setTemplates] = useState<ActiveTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load templates from either localStorage or Supabase
  const loadTemplates = useCallback(async () => {
    setIsLoading(true);
    
    try {
      if (user) {
        // Load from Supabase if user is authenticated
        const { data, error } = await supabase
          .from('habit_templates')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true);
          
        if (error) {
          throw error;
        }
        
        // Convert from database format to application format
        if (data) {
          const convertedTemplates = data.map(item => {
            // Parse habits from JSON string
            const habits = item.habits ? JSON.parse(item.habits) : [];
            
            // Create ActiveTemplate structure
            const template: ActiveTemplate = {
              templateId: item.id,
              name: item.name,
              description: item.description,
              activeDays: item.days || [],
              customized: true,
              habits
            };
            
            // Ensure consistent structure
            return migrateHabitTemplate(template);
          });
          
          setTemplates(convertedTemplates);
        }
      } else {
        // Load from localStorage if not authenticated
        const savedTemplates = localStorage.getItem('habit-templates');
        if (savedTemplates) {
          const parsedTemplates = JSON.parse(savedTemplates);
          // Ensure consistent structure
          const migratedTemplates = parsedTemplates.map(migrateHabitTemplate);
          setTemplates(migratedTemplates);
        }
      }
    } catch (error) {
      console.error('Error loading habit templates:', error);
      toast.error('Failed to load habit templates');
      
      // Fallback to localStorage in case of error
      const savedTemplates = localStorage.getItem('habit-templates');
      if (savedTemplates) {
        try {
          const parsedTemplates = JSON.parse(savedTemplates);
          const migratedTemplates = parsedTemplates.map(migrateHabitTemplate);
          setTemplates(migratedTemplates);
        } catch (e) {
          console.error('Error parsing localStorage templates:', e);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Save templates to either localStorage or Supabase
  const saveTemplates = useCallback(async (newTemplates: ActiveTemplate[]) => {
    try {
      // Always save to localStorage as a backup
      localStorage.setItem('habit-templates', JSON.stringify(newTemplates));
      
      // If authenticated, also save to Supabase
      if (user) {
        // Convert templates to database format
        const dbTemplates = newTemplates.map(template => ({
          id: template.templateId,
          user_id: user.id,
          name: template.name || 'Unnamed Template',
          description: template.description || '',
          days: template.activeDays || [],
          habits: JSON.stringify(template.habits || []),
          is_active: true
        }));
        
        // Upsert to Supabase
        const { error } = await supabase
          .from('habit_templates')
          .upsert(dbTemplates, { onConflict: 'id' });
          
        if (error) {
          throw error;
        }
      }
      
      // Update state
      setTemplates(newTemplates);
    } catch (error) {
      console.error('Error saving habit templates:', error);
      toast.error('Failed to save habit templates');
    }
  }, [user]);
  
  // Delete a template
  const deleteTemplate = useCallback(async (templateId: string) => {
    try {
      // Remove from state and localStorage
      const updatedTemplates = templates.filter(t => t.templateId !== templateId);
      localStorage.setItem('habit-templates', JSON.stringify(updatedTemplates));
      setTemplates(updatedTemplates);
      
      // If authenticated, also delete from Supabase
      if (user) {
        // Mark as inactive rather than deleting
        const { error } = await supabase
          .from('habit_templates')
          .update({ is_active: false })
          .eq('id', templateId)
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error deleting habit template:', error);
      toast.error('Failed to delete habit template');
    }
  }, [templates, user]);
  
  // Load templates on component mount and when user changes
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);
  
  return {
    templates,
    isLoading,
    saveTemplates,
    deleteTemplate,
    refreshTemplates: loadTemplates
  };
};
