
import React, { useCallback, forwardRef, ForwardedRef, useState, useEffect, useRef } from 'react';
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
  const [internalContent, setInternalContent] = useState('');
  const [isToolbarAction, setIsToolbarAction] = useState(false);
  const toolbarActionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const content = externalContent !== undefined ? externalContent : internalContent;

  useEffect(() => {
    if (selectedNote && !externalContent) {
      setInternalContent(selectedNote.content);
    }
  }, [selectedNote, externalContent]);

  // Clean up any pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (toolbarActionTimeoutRef.current) {
        clearTimeout(toolbarActionTimeoutRef.current);
      }
    };
  }, []);

  const handleChange = (newContent: string | undefined) => {
    if (newContent === undefined) return;
    
    if (externalOnChange) {
      externalOnChange(newContent);
    } else {
      setInternalContent(newContent);
    }
  };

  const handleBlur = useCallback(() => {
    console.log('Editor blur event triggered, isToolbarAction:', isToolbarAction);
    
    // Skip autosave if this is coming from a toolbar action
    if (isToolbarAction) {
      console.log('Skipping autosave due to toolbar action');
      return;
    }

    // Only auto-save if there is content and it's different from the original
    if (content?.trim() && (!selectedNote || selectedNote.content !== content)) {
      console.log('Auto-saving on blur...');
      handleSave();
    }
  }, [content, selectedNote, isToolbarAction]);

  const handleSave = useCallback(() => {
    if (!content?.trim()) return;

    try {
      if (externalOnSave) {
        externalOnSave();
        return;
      }

      const savedNotes = localStorage.getItem('notes');
      const currentNotes: Note[] = savedNotes ? JSON.parse(savedNotes) : [];

      let updatedNotes: Note[];
      let savedNote: Note;
      
      if (selectedNote) {
        const noteIndex = currentNotes.findIndex(n => n.id === selectedNote.id);
        
        savedNote = {
          ...selectedNote,
          content: content.trim(),
          updatedAt: new Date().toISOString()
        };
        
        if (noteIndex >= 0) {
          updatedNotes = [...currentNotes];
          updatedNotes[noteIndex] = savedNote;
        } else {
          updatedNotes = [savedNote, ...currentNotes];
        }
        
        eventManager.emit('note:update', savedNote);
      } else {
        savedNote = {
          id: crypto.randomUUID(),
          title: 'New Note',
          content: content.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: []
        };
        
        updatedNotes = [savedNote, ...currentNotes];
        eventManager.emit('note:create', savedNote);
      }

      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      window.dispatchEvent(new Event('notesUpdated'));

      if (onNoteSaved) {
        onNoteSaved();
      }
      
      if (!externalContent) {
        setInternalContent('');
      }
      
      // Only show the success toast for explicit (manual) saves, not auto-saves
      if (!isToolbarAction) {
        toast.success(selectedNote ? "Note updated ✨" : "Note saved ✨", {
          duration: 1500
        });
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Unable to save note');
    }
  }, [content, externalOnSave, onNoteSaved, selectedNote, externalContent, isToolbarAction]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  const handleToolbarAction = (action: string) => {
    console.log('Toolbar action detected:', action);
    // Set the flag to prevent auto-save on blur after toolbar actions
    setIsToolbarAction(true);
    
    // Clear any existing timeout
    if (toolbarActionTimeoutRef.current) {
      clearTimeout(toolbarActionTimeoutRef.current);
    }
    
    // Reset flag after a longer delay to allow for the formatting operation to complete
    // and prevent multiple toolbar actions from triggering auto-save
    toolbarActionTimeoutRef.current = setTimeout(() => {
      console.log('Resetting toolbar action flag');
      setIsToolbarAction(false);
    }, 2000); // Increased to 2 seconds for better safety
  };

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
          onToolbarAction={handleToolbarAction}
          className="h-full markdown-editor"
          preview="edit"
        />
      </div>
    </div>
  );
});

NotesEditor.displayName = 'NotesEditor';
