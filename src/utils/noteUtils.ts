
import { Note, Tag, TagColor, isValidTagColor } from '@/types/notes';

export const STORAGE_KEY = 'notes';

export const sanitizeContent = (content: string) => {
  return content.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
};

export const parseStoredNotes = (savedNotes: string | null): Note[] => {
  if (!savedNotes) return [];
  
  try {
    const parsedNotes = JSON.parse(savedNotes);
    return parsedNotes.map((note: any) => ({
      ...note,
      tags: Array.isArray(note.tags) ? note.tags.map((tag: string | Tag) => {
        if (typeof tag === 'string') {
          return { name: tag, color: 'default' as TagColor };
        }
        return {
          name: tag.name,
          color: isValidTagColor(tag.color) ? tag.color : 'default'
        };
      }) : []
    }));
  } catch (error) {
    console.error('Error parsing notes:', error);
    return [];
  }
};

export const createNewNote = (content: string): Note => ({
  id: crypto.randomUUID(),
  title: 'New Note', // Add default title
  content: sanitizeContent(content.trim()),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  tags: []
});
