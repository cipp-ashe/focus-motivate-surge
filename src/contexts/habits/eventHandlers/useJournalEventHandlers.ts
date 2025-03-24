
import { eventManager } from '@/lib/events/EventManager';
import { relationshipManager } from '@/lib/relationshipManager';
import { ActiveTemplate } from '@/types/habits/types';
import { EntityType } from '@/types/core';

export const useJournalEventHandlers = (
  templates: ActiveTemplate[], 
  dispatch: React.Dispatch<any>
) => {
  // Handle journal creation to mark habits as complete
  const handleJournalCreation = ({ habitId, templateId }: { habitId: string, templateId?: string }) => {
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
          const template = templates.find(t => 
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
  };

  // Handle journal deletion
  const handleJournalDeletion = ({ habitId }: { habitId: string }) => {
    console.log("Event received: habit:journal-deleted", { habitId });
    
    // Check if there are any remaining notes for this habit
    const relatedNotes = relationshipManager.getRelatedEntities(habitId, EntityType.Habit, EntityType.Note);
    
    // If there are no more notes, mark the habit as uncompleted
    if (relatedNotes.length === 0) {
      // Find which template contains this habit
      let templateId: string | undefined;
      
      for (const template of templates) {
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
  };

  return {
    handleJournalCreation,
    handleJournalDeletion
  };
};
