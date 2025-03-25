import { Note, NoteTag, TagColor, NoteType } from '@/types/notes';
import { format, formatDistanceToNow } from 'date-fns';
import { STORAGE_KEYS } from './constants';

// Export the storage key constant
export const STORAGE_KEY = STORAGE_KEYS.NOTES;

/**
 * Format a date string
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a date relative to now
 */
export const formatRelativeDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return 'some time ago';
  }
};

/**
 * Get a color for a note tag
 */
export const getTagColor = (color: TagColor | undefined): string => {
  const colorMap: Record<TagColor, string> = {
    default: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300',
    teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300',
  };

  return colorMap[color || 'default'];
};

/**
 * Get a note icon based on type
 */
export const getNoteTypeIcon = (type: NoteType): string => {
  const iconMap: Record<NoteType, string> = {
    standard: 'file-text',
    journal: 'book-open',
    task: 'check-square',
    habit: 'activity',
    markdown: 'code',
  };

  return iconMap[type] || 'file-text';
};

/**
 * Get a color class for a note title based on type
 */
export const getNoteTitleColor = (type: NoteType): string => {
  const colorMap: Record<NoteType, string> = {
    standard: 'text-blue-600 dark:text-blue-400',
    journal: 'text-purple-600 dark:text-purple-400',
    task: 'text-green-600 dark:text-green-400',
    habit: 'text-orange-600 dark:text-orange-400',
    markdown: 'text-teal-600 dark:text-teal-400',
  };

  return colorMap[type] || 'text-blue-600 dark:text-blue-400';
};

/**
 * Sanitize content for storage
 */
export const sanitizeContent = (content: string): string => {
  if (!content) return '';

  // Basic sanitation - remove potentially harmful scripts
  return content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
};

/**
 * Extract preview text from note content
 */
export const getPreviewText = (content: string, length: number = 120): string => {
  // Remove any markdown formatting
  const textOnly = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`(.+?)`/g, '$1') // Remove inline code
    .trim();

  if (textOnly.length <= length) {
    return textOnly;
  }

  return textOnly.substring(0, length) + '...';
};

/**
 * Filter notes by search term, tag, and type
 */
export const filterNotes = (
  notes: Note[],
  searchTerm: string = '',
  tagFilter: string | null = null,
  typeFilter: NoteType | null = null,
  showArchived: boolean = false
): Note[] => {
  return notes.filter((note) => {
    // Filter by archive status
    if (!showArchived && note.archived) {
      return false;
    }

    // Filter by tag if specified
    if (tagFilter && !note.tags.some((tag) => tag.id === tagFilter)) {
      return false;
    }

    // Filter by type if specified
    if (typeFilter && note.type !== typeFilter) {
      return false;
    }

    // Filter by search term if specified
    if (searchTerm) {
      const termLower = searchTerm.toLowerCase();
      return (
        note.title.toLowerCase().includes(termLower) ||
        note.content.toLowerCase().includes(termLower) ||
        note.tags.some((tag) => tag.name.toLowerCase().includes(termLower))
      );
    }

    return true;
  });
};

/**
 * Download note as markdown
 */
export const downloadNoteAsMarkdown = (note: Note): void => {
  const content = `# ${note.title}\n\n${note.content}`;
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${note.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Sort notes by specified criteria
 */
export const sortNotes = (
  notes: Note[],
  sortBy: 'createdAt' | 'updatedAt' | 'title' = 'updatedAt',
  direction: 'asc' | 'desc' = 'desc'
): Note[] => {
  // Create a copy to avoid mutating the original array
  const sorted = [...notes];

  sorted.sort((a, b) => {
    // Always put pinned notes first
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    // Then sort by the specified criteria
    if (sortBy === 'title') {
      return direction === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    } else {
      const dateA = new Date(a[sortBy]).getTime();
      const dateB = new Date(b[sortBy]).getTime();
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
  });

  return sorted;
};
