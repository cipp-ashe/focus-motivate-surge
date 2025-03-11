
import { Note } from "@/types/notes";
import { relationshipManager } from "@/lib/relationshipManager";
import { EntityType } from '@/types/core';
import { journalTemplates } from "./constants";

// Helper function to determine journal type
export const getJournalType = (habitName: string, description: string = ""): string => {
  const lowerName = habitName.toLowerCase();
  const lowerDesc = description.toLowerCase();
  
  if (lowerName.includes("gratitude") || lowerDesc.includes("gratitude")) {
    return "gratitude";
  } else if (lowerName.includes("reflect") || lowerDesc.includes("reflect")) {
    return "reflection";
  } else if (lowerName.includes("mindful") || lowerDesc.includes("mindful") || 
             lowerName.includes("meditat") || lowerDesc.includes("meditat")) {
    return "mindfulness";
  }
  
  // Default to gratitude if no match
  return "gratitude";
};

// Helper to find existing journal notes for a habit
export const findExistingJournalNote = (
  habitId: string, 
  notesCollection: Note[]
): Note | null => {
  const relatedEntities = relationshipManager.getRelatedEntities(
    habitId, 
    EntityType.Habit, 
    EntityType.Note
  );
  
  if (relatedEntities.length > 0) {
    // We have a related note, find it in our notes collection
    const noteId = relatedEntities[0].id;
    return notesCollection.find(note => note.id === noteId) || null;
  }
  
  return null;
};

// Get template based on journal type
export const getTemplateForType = (journalType: string) => {
  return journalTemplates[journalType] || journalTemplates.gratitude;
};
