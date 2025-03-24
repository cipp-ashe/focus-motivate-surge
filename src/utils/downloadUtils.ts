
import { formatDate } from '@/lib/utils/formatters';

/**
 * Utility functions for downloading content
 */

// Download a file with the given content
export const downloadContent = (filename: string, content: string, contentType = 'text/plain'): void => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// Download a single note as markdown
export const downloadNoteAsMarkdown = (title: string, content: string): void => {
  const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filename = `${safeTitle}_${formatDate(new Date(), 'yyyy-MM-dd')}.md`;
  
  let markdownContent = `# ${title}\n\n`;
  markdownContent += content;
  
  downloadContent(filename, markdownContent, 'text/markdown');
};

// Download all notes as a zip file
export const downloadAllNotes = (notes: any[]): void => {
  if (!notes || notes.length === 0) {
    console.error('No notes to download');
    return;
  }
  
  import('jszip').then(({ default: JSZip }) => {
    const zip = new JSZip();
    const notesFolder = zip.folder('notes');
    
    if (!notesFolder) {
      console.error('Could not create notes folder');
      return;
    }
    
    notes.forEach(note => {
      const safeTitle = note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filename = `${safeTitle}_${formatDate(new Date(note.updatedAt || note.createdAt), 'yyyy-MM-dd')}.md`;
      
      let markdownContent = `# ${note.title}\n\n`;
      markdownContent += note.content;
      
      notesFolder.file(filename, markdownContent);
    });
    
    zip.generateAsync({ type: 'blob' }).then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notes_export_${formatDate(new Date(), 'yyyy-MM-dd')}.zip`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }).catch(err => {
    console.error('Error downloading notes:', err);
  });
};
