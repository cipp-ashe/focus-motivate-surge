
import { useEffect } from 'react';
import { eventBus } from '@/lib/eventBus';
import { ActiveTemplate } from '@/components/habits/types';
import { EntityType } from '@/types/core';
import { useNotes } from '@/hooks/data/useNotes';

/**
 * Set up event listeners for habit-related events
 * This version doesn't depend on useHabitState - templates are passed as a parameter
 */
export const useHabitEvents = (templates: ActiveTemplate[] = []) => {
  const { saveNote } = useNotes();
  
  // Listen for journal open events and create a note from habit
  useEffect(() => {
    const handleJournalOpen = (data: {
      habitId: string;
      habitName: string;
      description?: string;
      templateId?: string;
    }) => {
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
    };
    
    // Register event handlers
    const unsubscribe = eventBus.on('journal:open', handleJournalOpen);
    
    return () => {
      unsubscribe();
    };
  }, [templates, saveNote]);
  
  return {}; // Return an empty object as we're just setting up listeners
};
