
import { Note } from '@/types/notes';
import { format } from 'date-fns';

/**
 * Creates a markdown string from a note
 */
export const noteToMarkdown = (note: Note): string => {
  const createdDate = format(new Date(note.createdAt), 'PPpp');
  const updatedDate = format(new Date(note.updatedAt), 'PPpp');
  const tags = note.tags.map(t => `#${t.name}`).join(' ');
  
  return `# ${note.title}

*Created: ${createdDate}*
*Updated: ${updatedDate}*
${tags ? `*Tags: ${tags}*` : ''}

${note.content}`;
};

/**
 * Download a note as a markdown file
 */
export const downloadNoteAsMarkdown = (note: Note): void => {
  const markdown = noteToMarkdown(note);
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${note.title.replace(/[^\w\s]/gi, '_').toLowerCase()}_${format(new Date(), 'yyyyMMdd')}.md`;
  a.click();
  
  URL.revokeObjectURL(url);
};

/**
 * Download all notes as a ZIP file
 */
export const downloadAllNotes = (notes: Note[]): void => {
  if (!notes.length) return;
  
  // For now just download as a JSON file since we don't have JSZip dependency
  const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `notes_backup_${format(new Date(), 'yyyyMMdd')}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
};
