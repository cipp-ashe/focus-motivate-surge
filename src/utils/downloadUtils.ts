import { Note } from '@/types/notes';

/**
 * Download a text file with all notes content
 */
export const downloadAllNotes = (notes: Note[]) => {
  if (!notes || notes.length === 0) {
    console.log('No notes to download');
    return;
  }

  try {
    const notesText = notes
      .map((note) => {
        const date = new Date(note.updatedAt || note.createdAt).toLocaleString();
        const tags = note.tags?.map((tag) => `#${tag.name}`).join(' ') || '';

        return `--- ${note.title || 'Untitled'} (${date}) ---\n${tags ? `Tags: ${tags}\n` : ''}${
          note.content
        }\n\n`;
      })
      .join('\n');

    const blob = new Blob([notesText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `my-notes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  } catch (error) {
    console.error('Error downloading notes:', error);
  }
};

/**
 * Download a single note as markdown
 */
export const downloadNote = (note: Note) => {
  if (!note) return;

  try {
    const date = new Date(note.updatedAt || note.createdAt).toLocaleString();
    const tags = note.tags?.map((tag) => `#${tag.name}`).join(' ') || '';

    const content = `# ${note.title || 'Untitled Note'}\n\nDate: ${date}\n${
      tags ? `Tags: ${tags}\n` : ''
    }\n${note.content}`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `${note.title || 'note'}-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  } catch (error) {
    console.error('Error downloading note:', error);
  }
};

/**
 * Generic function to download any content as a file
 * @param content The content to download
 * @param filename The name of the file to download
 * @param mimeType The MIME type of the file
 */
export const downloadContent = async (
  content: string,
  filename: string,
  mimeType: string = 'text/plain'
) => {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);

    return true;
  } catch (error) {
    console.error('Error downloading content:', error);
    return false;
  }
};
