
import { Note } from "@/types/note";

/**
 * Utility functions for journal operations
 */

/**
 * Formats a date string for journal display
 */
export const formatJournalDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Finds a journal entry for a habit on a specific date
 */
export const findJournalEntry = (
  habitId: string,
  date: string,
  notes: Note[]
): Note | undefined => {
  return notes.find(note => {
    const relationshipFound = note.relationships?.some(rel => 
      rel.entityId === habitId && 
      rel.metadata?.date === date
    );
    return relationshipFound;
  });
};

/**
 * Gets a list of journal entries for a habit
 */
export const getJournalEntriesForHabit = (
  habitId: string,
  notes: Note[],
  limit?: number
): Note[] => {
  const entries = notes.filter(note => 
    note.relationships?.some(rel => rel.entityId === habitId)
  );
  
  // Sort by date, newest first
  const sorted = entries.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  return limit ? sorted.slice(0, limit) : sorted;
};

/**
 * Creates a new journal entry from template
 */
export const createJournalEntryTemplate = (habitName: string): string => {
  return `# ${habitName} - ${new Date().toLocaleDateString()}

## Today's Progress
*How did you do with this habit today?*

## Challenges Faced
*What made this habit difficult today?*

## Tomorrow's Plan
*How will you improve tomorrow?*
`;
};
