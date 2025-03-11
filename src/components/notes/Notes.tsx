
import React, { useState, useEffect, useRef } from 'react';
import { NotesEditor, NotesEditorRef } from './NotesEditor';
import { SavedNotes } from './SavedNotes';
import { NotesProps } from '@/types/notes';
import type { Note } from '@/hooks/useNotes';

export const Notes: React.FC<NotesProps> = ({ hideNotes }) => {
  const [noteContent, setNoteContent] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const editorRef = useRef<NotesEditorRef>(null);

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
    setSelectedNote(null);
    setNoteContent('');
  };

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
