
import { useEffect } from 'react';
import { toast } from 'sonner';
import { eventBus } from '@/lib/eventBus';
import { relationshipManager } from '@/lib/relationshipManager';
import { HabitDetail } from '@/components/habits/types';

// This hook handles event subscriptions for habits
export const useHabitEvents = () => {
  useEffect(() => {
    // Listen for journal deletion events from note context
    const unsubscribe = eventBus.on('note:deleted', ({ noteId }) => {
      console.log("Event received: note:deleted", { noteId });
      
      // Find any habits related to this note
      const relatedHabits = relationshipManager.getRelatedEntities(noteId, 'note', 'habit');
      
      if (relatedHabits.length > 0) {
        console.log(`Found ${relatedHabits.length} habits related to deleted note:`, relatedHabits);
        
        // For each related habit, emit an event to mark it as uncompleted
        relatedHabits.forEach(entity => {
          // Delete the relationship
          relationshipManager.deleteRelationship(entity.id, noteId);
          
          // Emit event to update the habit's completion status
          eventBus.emit('habit:journal-deleted', {
            habitId: entity.id,
          });
          
          console.log(`Emitted habit:journal-deleted for habit ${entity.id}`);
        });
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  return null;
};
