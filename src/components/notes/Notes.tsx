
import React, { useEffect } from 'react';
import { NotesEditor } from './NotesEditor';
import { SavedNotes } from './SavedNotes';
import { useNotes } from '@/hooks/useNotes';
import { toast } from 'sonner';

export const Notes = () => {
  // Add comprehensive logging to monitor component rendering and state
  useEffect(() => {
    console.log('Notes component mounted');
    
    try {
      // Check if localStorage is available
      const testKey = '_test_localStorage_';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      
      // Verify notes data format in localStorage
      const savedNotes = localStorage.getItem('notes');
      console.log('Notes in localStorage:', savedNotes ? 'exists' : 'not found');
      if (savedNotes) {
        try {
          const parsedNotes = JSON.parse(savedNotes);
          console.log('Notes parsed successfully:', Array.isArray(parsedNotes) ? `${parsedNotes.length} notes` : 'not an array');
        } catch (e) {
          console.error('Failed to parse notes from localStorage:', e);
        }
      }
    } catch (e) {
      console.error('localStorage test failed:', e);
    }
    
    return () => console.log('Notes component unmounted');
  }, []);

  const { 
    notes,
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

  // Add detailed logging to debug state values
  useEffect(() => {
    console.log('Notes state updated:', { 
      hasNotes: Array.isArray(notes) ? notes.length > 0 : false, 
      notesCount: Array.isArray(notes) ? notes.length : 'notes is not an array',
      hasSelectedNote: !!selectedNote, 
      selectedNoteId: selectedNote?.id || 'none',
      contentLength: currentContent?.length || 0 
    });
  }, [notes, selectedNote, currentContent]);

  const handleSave = () => {
    console.log('Attempting to save note', { 
      hasSelectedNote: !!selectedNote,
      contentValid: !!currentContent?.trim()
    });
    
    if (!currentContent?.trim()) {
      console.log('Cannot save empty note');
      toast.error('Cannot save empty note');
      return;
    }
    
    try {
      if (selectedNote) {
        console.log('Updating existing note:', selectedNote.id);
        updateNote(selectedNote.id, currentContent);
      } else {
        console.log('Creating new note');
        addNote();
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note. Please try again.');
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
