
import React, { useState, useEffect, useRef } from 'react';
import { NotesEditor, NotesEditorRef } from './NotesEditor';
import { SavedNotes } from './SavedNotes';
import { NotesProps } from '@/types/notes';
import type { Note } from '@/hooks/useNotes';
import { eventManager } from '@/lib/events/EventManager';

export const Notes: React.FC<NotesProps> = ({ hideNotes }) => {
  const [noteContent, setNoteContent] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const editorRef = useRef<NotesEditorRef>(null);
  const [isFormatting, setIsFormatting] = useState(false);

  // Make sure noteContent is a string
  const handleChange = (content: string | undefined) => {
    if (content !== undefined) {
      setNoteContent(content);
    }
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setNoteContent(note.content);
  };

  const handleNoteSaved = () => {
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

  // Add debugging to check component rendering
  useEffect(() => {
    console.log("Notes component rendered", { hideNotes, selectedNote });
  }, [hideNotes, selectedNote]);

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
