
import { format } from 'date-fns';
import { marked } from 'marked';
import type { Note, Tag } from '@/types/notes';
import { toast } from 'sonner';
import { formatDateLocalized } from '@/lib/utils/formatters';

interface SaveFileParams {
  content: string;
  filename: string;
  mimeType: string;
}

interface ElectronWindow extends Window {
  electron?: {
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    close: () => Promise<void>;
    saveFile?: (params: SaveFileParams) => Promise<void>;
  };
}

declare const window: ElectronWindow;

/**
 * Downloads content using appropriate method for web or electron
 */
export const downloadContent = async (content: string, filename: string, mimeType: string = 'text/plain') => {
  try {
    if (window.electron?.saveFile) {
      try {
        console.log('Attempting Electron download...');
        await window.electron.saveFile({
          content,
          filename,
          mimeType
        });
        console.log('Electron download successful');
        toast.success('File downloaded successfully');
      } catch (error) {
        console.error('Electron save failed, falling back to web download:', error);
        webDownload(content, filename, mimeType);
      }
    } else {
      console.log('Using web download...');
      webDownload(content, filename, mimeType);
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    toast.error('Failed to download file');
    try {
      webDownload(content, filename, mimeType);
    } catch (fallbackError) {
      console.error('Web download fallback also failed:', fallbackError);
      toast.error('Download failed completely');
    }
  }
};

/**
 * Web download implementation
 */
const webDownload = (content: string, filename: string, mimeType: string) => {
  try {
    console.log('Creating blob for web download...');
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    console.log('Creating download link...');
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    
    console.log('Triggering download...');
    document.body.appendChild(a);
    a.click();
    
    // Small delay before cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log('Web download cleanup complete');
    }, 100);
    
    toast.success('File downloaded successfully');
  } catch (error) {
    console.error('Web download failed:', error);
    throw error;
  }
};

const formatTags = (tags: Tag[]): string => {
  if (tags.length === 0) return '';
  const tagStrings = tags.map(tag => `${tag.name} (${tag.color})`);
  return `Tags: ${tagStrings.join(', ')}`;
};

const generateUniqueId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 5);
  return `${timestamp}-${random}`;
};

/**
 * Downloads note content as markdown
 */
export const downloadNoteAsMarkdown = async (note: Note) => {
  console.log('Preparing note for download:', note.id);
  const timestamp = formatDateLocalized(new Date(note.createdAt));
  const metadata = [
    `Created: ${format(new Date(note.createdAt), 'MMM d, yyyy HH:mm')}`,
    note.updatedAt && `Updated: ${format(new Date(note.updatedAt), 'MMM d, yyyy HH:mm')}`,
    note.tags.length > 0 && formatTags(note.tags)
  ].filter(Boolean).join('\n');

  const markdown = `# ${timestamp}\n\n${note.content}\n\n---\n\n${metadata}`;
  const uniqueId = generateUniqueId();
  const filename = `note-${format(new Date(note.createdAt), 'yyyy-MM-dd-HH-mm-ss')}-${uniqueId}.md`;
  
  console.log('Starting note download...');
  await downloadContent(markdown, filename, 'text/markdown');
};

/**
 * Downloads all notes as a single markdown file
 */
export const downloadAllNotes = async (notes: Note[]) => {
  console.log('Preparing all notes for download:', notes.length, 'notes');
  const timestamp = format(new Date(), 'MMMM d, yyyy');
  
  const notesContent = notes.map(note => {
    const noteTimestamp = formatDateLocalized(new Date(note.createdAt));
    const metadata = [
      `Created: ${format(new Date(note.createdAt), 'MMM d, yyyy HH:mm')}`,
      note.updatedAt && `Updated: ${format(new Date(note.updatedAt), 'MMM d, yyyy HH:mm')}`,
      note.tags.length > 0 && formatTags(note.tags)
    ].filter(Boolean).join('\n');

    return `# ${noteTimestamp}\n\n${note.content}\n\n---\n\n${metadata}\n\n`;
  }).join('\n');

  const uniqueId = generateUniqueId();
  const markdown = `# Flowtime Focus Notes - ${timestamp}\n\n${notesContent}`;
  const filename = `flowtime-focus-notes-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}-${uniqueId}.md`;
  console.log('Starting bulk download...');
  await downloadContent(markdown, filename, 'text/markdown');
};
