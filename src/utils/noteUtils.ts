
import { Note, NoteTag, TagColor } from '@/types/notes';
import { v4 as uuidv4 } from 'uuid';

// Storage key for notes
export const STORAGE_KEY = 'notes';

/**
 * Sanitize content to remove potentially harmful content
 */
export const sanitizeContent = (content: string): string => {
  if (!content) return '';
  
  // Basic sanitization - in a real app, use a library like DOMPurify
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, 'removed:');
};

/**
 * Create a new note with default values
 */
export const createEmptyNote = (type: 'text' = 'text'): Note => {
  return {
    id: uuidv4(),
    title: 'Untitled Note',
    content: '',
    type,
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Create a new tag with the given name and color
 */
export const createTag = (name: string, color: TagColor = 'default'): NoteTag => {
  return { name, color };
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

/**
 * Download a note as a text file
 */
export const downloadNote = (note: Note): void => {
  const filename = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
  const text = `${note.title}\n\n${note.content}\n\nCreated: ${formatDate(note.createdAt)}\nLast Updated: ${formatDate(note.updatedAt)}`;
  
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  
  element.style.display = 'none';
  document.body.appendChild(element);
  
  element.click();
  
  document.body.removeChild(element);
};

/**
 * Get a truncated preview of note content
 */
export const getNotePreview = (content: string, maxLength: number = 100): string => {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  
  return content.substring(0, maxLength) + '...';
};

/**
 * Process note content for display
 * This would be where you'd add any transformation of content (like Markdown rendering)
 */
export const processNoteContent = (content: string): string => {
  if (!content) return '';
  return content;
};
