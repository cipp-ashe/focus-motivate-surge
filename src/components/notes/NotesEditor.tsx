import React, { useCallback, forwardRef, ForwardedRef, useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import type { Note } from '@/types/notes';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { ActionButton } from '@/components/ui/action-button';
import { eventManager } from '@/lib/events/EventManager';

interface NotesEditorProps {
  selectedNote?: Note | null;
  onNoteSaved?: () => void;
  content?: string;
  onChange?: (content: string) => void;
  isEditing?: boolean;
  onSave?: () => void;
}

export interface NotesEditorRef {
  saveNotes: () => void;
}

export const NotesEditor = forwardRef<NotesEditorRef, NotesEditorProps>(({ 
  selectedNote,
  onNoteSaved,
  content: externalContent,
  onChange: externalOnChange,
  isEditing,
  onSave: externalOnSave
}, ref) => {
  // Use internal state if no external content is provided
  const [internalContent, setInternalContent] = useState('');
  
  // Determine which content to use (external or internal)
  const content = externalContent !== undefined ? externalContent : internalContent;

  // Update internal content when selectedNote changes
  useEffect(() => {
    if (selectedNote && !externalContent) {
      setInternalContent(selectedNote.content);
    }
  }, [selectedNote, externalContent]);

  const handleChange = (newContent: string | undefined) => {
    if (newContent === undefined) return;
    
    if (externalOnChange) {
      // If external onChange handler is provided, use it
      externalOnChange(newContent);
    } else {
      // Otherwise manage content internally
      setInternalContent(newContent);
    }
  };

  const handleSave = useCallback(() => {
    if (!content?.trim()) return;

    try {
      // If external save handler provided, use it
      if (externalOnSave) {
        externalOnSave();
        return;
      }

      // Otherwise, handle internally
      const savedNotes = localStorage.getItem('notes');
      const currentNotes: Note[] = savedNotes ? JSON.parse(savedNotes) : [];

      let updatedNotes: Note[];
      let savedNote: Note;
      
      if (selectedNote) {
        // Update existing note
        savedNote = {
          ...selectedNote,
          content: content.trim(),
          updatedAt: new Date().toISOString()
        };
        
        updatedNotes = currentNotes.map(note =>
          note.id === selectedNote.id ? savedNote : note
        );
        
        // Emit update event
        eventManager.emit('note:update', savedNote);
      } else {
        // Create new note
        savedNote = {
          id: crypto.randomUUID(),
          title: 'New Note', // Add a default title
          content: content.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: []
        };
        
        updatedNotes = [savedNote, ...currentNotes];
        
        // Emit create event
        eventManager.emit('note:create', savedNote);
      }

      // Save to localStorage
      localStorage.setItem('notes', JSON.stringify(updatedNotes));

      // Dispatch custom event for immediate update
      window.dispatchEvent(new Event('notesUpdated'));

      if (onNoteSaved) {
        onNoteSaved();
      }
      
      // Reset internal content after saving
      if (!externalContent) {
        setInternalContent('');
      }
      
      toast.success(selectedNote ? "Note updated ✨" : "Note saved ✨", {
        duration: 1500
      });
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    }
  }, [content, externalOnSave, onNoteSaved, selectedNote, externalContent]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  const handleBlur = useCallback(() => {
    // Auto-save on blur if there's content and it's different from the original
    if (content?.trim() && (!selectedNote || selectedNote.content !== content)) {
      handleSave();
    }
  }, [content, handleSave, selectedNote]);

  // Expose saveNotes method through ref
  React.useImperativeHandle(ref, () => ({
    saveNotes: handleSave
  }));

  return (
    <div className="flex flex-col gap-2 h-full notes-editor" onKeyDown={handleKeyDown}>
      <div className="flex justify-end mb-2">
        <ActionButton
          icon={Save}
          onClick={handleSave}
        >
          {isEditing ? 'Update' : 'Save'}
        </ActionButton>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden bg-background/50 rounded-lg border border-primary/10 shadow-inner">
        <MarkdownEditor
          value={content}
          onChange={handleChange}
          onBlur={handleBlur}
          className="h-full"
          preview="edit"
        />
      </div>
    </div>
  );
});

NotesEditor.displayName = 'NotesEditor';
