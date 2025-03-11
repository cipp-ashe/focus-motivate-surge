
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
    const handleFormatStart = ({ noteId }: { noteId: string }) => {
      if (selectedNote && selectedNote.id === noteId) {
        console.log('Format operation started for note:', noteId);
        setIsFormatting(true);
      }
    };

    const handleFormatComplete = ({ noteId }: { noteId: string }) => {
      if (selectedNote && selectedNote.id === noteId) {
        console.log('Format operation completed for note:', noteId);
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
