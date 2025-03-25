
import { Note, TagColor, NoteType } from '@/types/notes';
import { Book, File, Mic, CheckSquare, Clock } from 'lucide-react';

// Storage key for notes
export const STORAGE_KEY = 'notes';

// Function to sanitize content for storage
export const sanitizeContent = (content: string): string => {
  if (!content) return '';
  return content.replace(/(<script.*?>.*?<\/script>)/gi, '');
};

// Get appropriate icon for note type
export const getNoteTypeIcon = (type: NoteType) => {
  switch (type) {
    case 'journal':
    case 'habit-journal':
      return Book;
    case 'voice':
      return Mic;
    case 'task-journal':
      return CheckSquare;
    default:
      return File;
  }
};

// Get color for note title based on type
export const getNoteTitleColor = (type: NoteType): string => {
  switch (type) {
    case 'journal':
    case 'habit-journal':
      return 'bg-amber-500';
    case 'voice':
      return 'bg-rose-500';
    case 'task-journal':
      return 'bg-cyan-500';
    default:
      return 'bg-slate-500';
  }
};

// Get CSS classes for tag colors
export const getTagColor = (color: TagColor): string => {
  switch (color) {
    case 'red':
      return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/40';
    case 'green':
      return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/40';
    case 'blue':
      return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/40';
    case 'purple':
      return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/40';
    case 'yellow':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/40';
    case 'orange':
      return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/40';
    case 'cyan':
      return 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800/40';
    case 'pink':
      return 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800/40';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700/40';
  }
};

// Helper to create a download URL for a note
export const createNoteDownloadUrl = (note: Note): string => {
  const content = `# ${note.title}
Created: ${new Date(note.createdAt).toLocaleString()}
Updated: ${new Date(note.updatedAt).toLocaleString()}
Tags: ${note.tags.map(t => t.name).join(', ')}

${note.content}`;

  const blob = new Blob([content], { type: 'text/markdown' });
  return URL.createObjectURL(blob);
};

// Helper function to download a note
export const downloadNote = (note: Note): void => {
  const url = createNoteDownloadUrl(note);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
