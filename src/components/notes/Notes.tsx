
import React from 'react';
import { NotesEditor } from './NotesEditor';
import { SavedNotes } from './SavedNotes';
import { useNotes } from '@/hooks/useNotes';

export const Notes = () => {
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

  const handleSave = () => {
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
