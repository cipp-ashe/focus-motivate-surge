
import { useEffect } from 'react';
import { eventBus } from '@/lib/eventBus';
import { eventManager } from '@/lib/events/EventManager';
import { useHabitState } from './HabitContext';
import { useNotes } from '@/hooks/data/useNotes';
import { HabitTemplate } from '@/components/habits/types';

/**
 * Set up event listeners for habit-related events
 */
export const useHabitEvents = () => {
  const state = useHabitState();
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
        let template: HabitTemplate | undefined;
        if (data.templateId) {
          template = state.templates.find(t => t.templateId === data.templateId);
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
            tags: ['habit', 'journal'],
            relationships: {
              habitId: data.habitId,
              templateId: data.templateId
            }
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
  }, [state.templates, saveNote]);
  
  return {}; // Return an empty object as we're just setting up listeners
};
