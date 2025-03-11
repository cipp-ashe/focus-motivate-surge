import { useEffect } from 'react';
import { useNoteActions } from '../notes/NoteContext';
import { useHabitState } from './HabitContext';
import { eventManager } from '@/lib/events/EventManager';
import { Tag } from '@/types/notes';
import { relationshipManager } from '@/lib/relationshipManager';
import { EntityType } from '@/types/core';

export const useHabitEvents = () => {
  const noteActions = useNoteActions();
  const habitState = useHabitState();

  useEffect(() => {
    // Event handler for creating a note from a habit
    eventManager.on('note:create-from-habit', ({ habitId, habitName, description, templateId, content }) => {
      // Make sure habitId is required
      if (!habitId) {
        console.error('Missing habitId in note:create-from-habit event');
        return;
      }

      // Create tags for the journal entry
      const tags: Tag[] = [
        { name: 'journal', color: 'default' },
        { name: 'habit', color: 'default' }
      ];

      // Create a new note
      noteActions.createNote({
        title: `Journal Entry for ${habitName}`,
        content: content || `Journal entry for habit: ${habitName}\n${description}`,
        tags: tags,
        onCreate: (note) => {
          // Establish relationship between the habit and the new note
          relationshipManager.createRelationship(habitId, EntityType.Habit, note.id, EntityType.Note);
        }
      });
    });

    // Clean up event listeners when the component unmounts
    return () => {
      eventManager.off('note:create-from-habit');
    };
  }, [noteActions, habitState]);
};
