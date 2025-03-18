
import { useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { ActiveTemplate } from '@/components/habits/types';
import { EntityType } from '@/types/core';
import { useNotes } from '@/hooks/data/useNotes';
import { useEvent } from '@/hooks/useEvent';

/**
 * Set up event listeners for habit-related events
 * This version doesn't depend on useHabitState - templates are passed as a parameter
 */
export const useHabitEvents = (templates: ActiveTemplate[] = []) => {
  const { saveNote } = useNotes();
  
  // Listen for journal open events using the useEvent hook
  useEvent('journal:open', (data: any) => {
    // Make sure the data contains required fields
    if (!data || !data.habitId || !data.habitName) {
      console.error('Missing required data for journal:open event');
      return;
    }
    
    // Create a note for the journal
    try {
      console.log("Creating note from habit journal:", data);
      
      // Get template info if available
      let template: ActiveTemplate | undefined;
      if (data.templateId) {
        template = templates.find(t => t.templateId === data.templateId);
      }
      
      // Create the note
      const noteContent = `# ${data.habitName} Journal\n\n${data.description || ''}\n\n`;
      
      // Create note from habit journal
      if (saveNote) {
        saveNote({
          id: crypto.randomUUID(),
          title: `${data.habitName} Journal`,
          content: noteContent,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: [
            { name: 'habit', color: 'default' },
            { name: 'journal', color: 'default' }
          ],
          relationships: [
            { 
              entityId: data.habitId,
              entityType: EntityType.Habit
            }
          ]
        });
      }
    } catch (error) {
      console.error("Error creating note from habit:", error);
    }
  });
  
  return {}; // Return an empty object as we're just setting up listeners
};
