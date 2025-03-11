
import React, { useEffect } from 'react';
import { NotesEditor } from './NotesEditor';
import { SavedNotes } from './SavedNotes';
import { useNotes } from '@/hooks/useNotes';

export const Notes = () => {
  // Add logging to monitor component rendering
  useEffect(() => {
    console.log('Notes component mounted');
    return () => console.log('Notes component unmounted');
  }, []);

  const { 
    selectedNote,
    currentContent,
    updateCurrentContent,
    selectNoteForEdit,
    addNote,
    updateNote,
    deleteNote,
    addTagToNote,
    removeTagFromNote
  } = useNotes();

  // Add logging to debug state values
  useEffect(() => {
    console.log('Notes state:', { 
      hasSelectedNote: !!selectedNote, 
      contentLength: currentContent?.length || 0 
    });
  }, [selectedNote, currentContent]);

  const handleSave = () => {
    console.log('Attempting to save note', { hasSelectedNote: !!selectedNote });
    if (selectedNote) {
      updateNote(selectedNote.id, currentContent);
    } else {
      addNote();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <NotesEditor
        selectedNote={selectedNote}
        content={currentContent}
        onChange={updateCurrentContent}
        onSave={handleSave}
        isEditing={!!selectedNote}
      />
      
      <SavedNotes
        onEditNote={selectNoteForEdit}
        onUpdateTagColor={(noteId, tagName, color) => {
          addTagToNote(noteId, tagName, color);
        }}
      />
    </div>
  );
};
