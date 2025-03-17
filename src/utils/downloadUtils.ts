
import { formatDate } from "@/lib/utils/dateUtils";
import { Note } from "@/types/notes";
import { toast } from "sonner";

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const generateFileName = (prefix: string, extension: string) => {
  const date = formatDate(new Date(), 'yyyy-MM-dd_HH:mm');
  return `${prefix}_${date}.${extension}`;
};

/**
 * Downloads a single note as a markdown file
 * @param note The note to download
 */
export const downloadNoteAsMarkdown = async (note: Note): Promise<void> => {
  try {
    const filename = generateFileName(note.title || 'note', 'md');
    
    // Generate markdown content
    let content = `# ${note.title || 'Untitled Note'}\n\n`;
    
    // Add creation/update dates
    content += `*Created: ${formatDate(note.createdAt)}*\n`;
    if (note.updatedAt) {
      content += `*Updated: ${formatDate(note.updatedAt)}*\n`;
    }
    content += '\n';
    
    // Add tags if present
    if (note.tags && note.tags.length > 0) {
      const tagStr = note.tags.map(tag => `#${tag.name}`).join(' ');
      content += `*Tags: ${tagStr}*\n\n`;
    }
    
    // Add the main content
    content += note.content;
    
    // Download the file
    downloadFile(content, filename, 'text/markdown');
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error downloading note:', error);
    toast.error('Failed to download note');
    return Promise.reject(error);
  }
};

/**
 * Downloads all notes as a single markdown file
 * @param notes Array of notes to download
 */
export const downloadAllNotes = (notes: Note[]): void => {
  if (!notes || notes.length === 0) {
    toast.error('No notes to download');
    return;
  }
  
  try {
    const filename = generateFileName('all_notes', 'md');
    
    // Generate markdown content with a table of contents
    let content = `# Notes Collection\n\n`;
    content += `*Generated: ${formatDate(new Date())}*\n\n`;
    content += `## Table of Contents\n\n`;
    
    // Add table of contents
    notes.forEach((note, index) => {
      content += `${index + 1}. [${note.title || 'Untitled Note'}](#note-${index + 1})\n`;
    });
    
    // Add each note with a separator
    notes.forEach((note, index) => {
      content += `\n---\n\n`;
      content += `<a id="note-${index + 1}"></a>\n`;
      content += `## ${note.title || 'Untitled Note'}\n\n`;
      
      // Add creation/update dates
      content += `*Created: ${formatDate(note.createdAt)}*\n`;
      if (note.updatedAt) {
        content += `*Updated: ${formatDate(note.updatedAt)}*\n`;
      }
      content += '\n';
      
      // Add tags if present
      if (note.tags && note.tags.length > 0) {
        const tagStr = note.tags.map(tag => `#${tag.name}`).join(' ');
        content += `*Tags: ${tagStr}*\n\n`;
      }
      
      // Add the main content
      content += note.content;
    });
    
    // Download the file
    downloadFile(content, filename, 'text/markdown');
  } catch (error) {
    console.error('Error downloading all notes:', error);
    toast.error('Failed to download notes');
  }
};

/**
 * Downloads any content as a file
 * @param content Content to download
 * @param filename Name of the file
 * @param mimeType MIME type of the file
 */
export const downloadContent = (content: string, filename: string, mimeType: string): Promise<void> => {
  try {
    downloadFile(content, filename, mimeType);
    return Promise.resolve();
  } catch (error) {
    console.error('Error downloading content:', error);
    toast.error('Failed to download content');
    return Promise.reject(error);
  }
};
