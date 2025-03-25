import { TagColor, Note, NoteType } from '@/types/notes';
import { FileText, BookOpen, CheckSquare, Mic, Calendar } from 'lucide-react';

// Storage key for notes
export const STORAGE_KEY = 'notes';

/**
 * Get tag color styling based on color name
 */
export const getTagColor = (color: TagColor): string => {
  switch (color) {
    case 'red':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800/50';
    case 'green':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800/50';
    case 'blue':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/50';
    case 'purple':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800/50';
    case 'yellow':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/50';
    case 'orange':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800/50';
    case 'cyan':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/50';
    case 'pink':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200 dark:border-pink-800/50';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300 border-gray-200 dark:border-gray-700/50';
  }
};

/**
 * Get note type icon component
 */
export const getNoteTypeIcon = (type: NoteType) => {
  switch (type) {
    case 'journal':
      return BookOpen;
    case 'habit-journal':
      return Calendar;
    case 'task-journal':
      return CheckSquare;
    case 'voice':
      return Mic;
    default:
      return FileText;
  }
};

/**
 * Get background color based on note type
 */
export const getNoteTitleColor = (type: NoteType): string => {
  switch (type) {
    case 'journal':
      return 'bg-blue-500/90 dark:bg-blue-600';
    case 'habit-journal':
      return 'bg-green-500/90 dark:bg-green-600';
    case 'task-journal':
      return 'bg-purple-500/90 dark:bg-purple-600';
    case 'voice':
      return 'bg-orange-500/90 dark:bg-orange-600';
    default:
      return 'bg-gray-500/90 dark:bg-gray-600';
  }
};

/**
 * Sanitize content for storage
 */
export const sanitizeContent = (content: string): string => {
  if (!content) return '';
  
  // Basic XSS prevention
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
};

/**
 * Format date for note display
 */
export const formatNoteDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // Today
    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Yesterday
    if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Within last week
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'long' }) + 
        `, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Other dates
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};
