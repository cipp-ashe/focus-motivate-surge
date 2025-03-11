
import React, { useState, useEffect, useRef } from 'react';
import { NotesEditor, NotesEditorRef } from './NotesEditor';
import { SavedNotes } from './SavedNotes';
import { NotesProps } from '@/types/notes';
import type { Note } from '@/types/notes';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';

export const Notes: React.FC<NotesProps> = ({ hideNotes }) => {
  const [noteContent, setNoteContent] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const editorRef = useRef<NotesEditorRef>(null);
  const [isFormatting, setIsFormatting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Add initialization state
  useEffect(() => {
    console.log('Notes component mounted');
    
    // Set loaded state with a small delay to ensure all children have time to initialize
    setTimeout(() => {
      console.log('Notes component loaded');
      setIsLoaded(true);
    }, 100);
    
    return () => {
      console.log('Notes component unmounted');
    };
  }, []);

  // Make sure noteContent is a string
  const handleChange = (content: string | undefined) => {
    if (content !== undefined) {
      setNoteContent(content);
    }
  };

  const handleEditNote = (note: Note) => {
    console.log('Editing note:', note.id);
    setSelectedNote(note);
    setNoteContent(note.content);
  };

  const handleNoteSaved = () => {
    console.log('Note saved, isFormatting:', isFormatting);
    // Don't reset the editor if we're in the middle of a formatting operation
    if (!isFormatting) {
      setSelectedNote(null);
      setNoteContent('');
    }
  };

  // Listen for formatting events
  useEffect(() => {
    console.log("Setting up note formatting event listeners");
    
    const handleFormatStart = (data: { noteId: string; action: string }) => {
      console.log("Format start event received:", data);
      if (selectedNote && selectedNote.id === data.noteId) {
        console.log('Format operation started for note:', data.noteId);
        setIsFormatting(true);
      }
    };

    const handleFormatComplete = (data: { noteId: string }) => {
      console.log("Format complete event received:", data);
      if (selectedNote && selectedNote.id === data.noteId) {
        console.log('Format operation completed for note:', data.noteId);
        setIsFormatting(false);
      }
    };

    const formatStartUnsubscribe = eventManager.on('note:format', handleFormatStart);
    const formatCompleteUnsubscribe = eventManager.on('note:format-complete', handleFormatComplete);

    return () => {
      formatStartUnsubscribe();
      formatCompleteUnsubscribe();
    };
  }, [selectedNote]);

  if (!isLoaded) {
    console.log('Notes component not fully loaded yet');
    return <div className="p-4 text-center">Loading notes...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 mb-4">
        <NotesEditor 
          ref={editorRef}
          content={noteContent}
          onChange={handleChange}
          selectedNote={selectedNote}
          onNoteSaved={handleNoteSaved}
          isEditing={!!selectedNote}
        />
      </div>

      {!hideNotes && (
        <SavedNotes 
          onEditNote={handleEditNote}
        />
      )}
    </div>
  );
};
