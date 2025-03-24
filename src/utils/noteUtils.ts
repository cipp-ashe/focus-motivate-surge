
import { Note, Tag, TagColor } from '@/types/notes';
import { EntityType } from '@/types/core';

// Storage key for notes
export const STORAGE_KEY = 'notes';

// Function to sanitize content for storage
export const sanitizeContent = (content: string): string => {
  if (!content) return '';
  return content.replace(/(<script.*?>.*?<\/script>)/gi, '');
};

// Create a standard note object
export function createStandardNote(
  title: string = 'Untitled Note',
  content: string = '',
  tags: Tag[] = []
): Omit<Note, 'id'> {
  const now = new Date().toISOString();
  
  return {
    title,
    content,
    tags,
    createdAt: now,
    updatedAt: now
  };
}

// Helper to create a journal note
export function createJournalNote(
  title: string,
  content: string,
  habitId?: string,
  taskId?: string,
  templateId?: string
): Omit<Note, 'id'> {
  const now = new Date().toISOString();
  const relationships = [];
  
  // Add habit relationship if applicable
  if (habitId) {
    relationships.push({
      entityId: habitId,
      entityType: EntityType.Habit,
      metadata: {
        templateId,
        date: now
      }
    });
  }
  
  // Add task relationship if applicable
  if (taskId) {
    relationships.push({
      entityId: taskId,
      entityType: EntityType.Task,
      metadata: {
        date: now
      }
    });
  }
  
  return {
    title,
    content,
    tags: [
      { name: 'journal', color: 'blue' as TagColor }
    ],
    relationships,
    createdAt: now,
    updatedAt: now
  };
}

// Function to get the color for a tag
export const getTagColor = (tagName: string): TagColor => {
  const lowerTag = tagName.toLowerCase();
  
  if (lowerTag === 'important' || lowerTag === 'urgent') {
    return 'red';
  } else if (lowerTag === 'work' || lowerTag === 'project') {
    return 'blue';
  } else if (lowerTag === 'personal' || lowerTag === 'private') {
    return 'purple';
  } else if (lowerTag === 'idea' || lowerTag === 'inspiration') {
    return 'yellow';
  } else if (lowerTag === 'journal' || lowerTag === 'diary') {
    return 'teal';
  } else if (lowerTag === 'habit' || lowerTag === 'routine') {
    return 'green';
  } else if (lowerTag === 'meeting' || lowerTag === 'event') {
    return 'orange';
  } else if (lowerTag === 'task' || lowerTag === 'todo') {
    return 'cyan';
  }
  
  // Default color
  return 'default';
};
