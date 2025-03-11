
import React, { useEffect, useState } from 'react';
import { NotesEditor } from './NotesEditor';
import { SavedNotes } from './SavedNotes';
import { toast } from 'sonner';
import { useNoteActions, useNoteState } from '@/contexts/notes/NoteContext';
import { eventManager } from '@/lib/events/EventManager';

export const Notes = () => {
  // Use state to track initialization
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use the note context instead of using useNotes directly
  const { 
    updateCurrentContent, 
    selectNoteForEdit, 
    addNote, 
    updateNote, 
    deleteNote, 
    addTagToNote, 
    removeTagFromNote 
  } = useNoteActions();
  
  const { items: notes, selected: selectedNote, content: currentContent } = useNoteState();
  
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
          
          // Dispatch event to ensure notes are loaded
          window.dispatchEvent(new Event('notesUpdated'));
        } catch (e) {
          console.error('Failed to parse notes from localStorage:', e);
        }
      }
      
      // Mark as initialized after checks
      setIsInitialized(true);
    } catch (e) {
      console.error('localStorage test failed:', e);
      toast.error('Failed to access localStorage. This feature may not work properly.');
    }
    
    return () => console.log('Notes component unmounted');
  }, []);

  // Add detailed logging to debug state values
  useEffect(() => {
    console.log('Notes state updated:', { 
      hasNotes: Array.isArray(notes) ? notes.length > 0 : false, 
      notesCount: Array.isArray(notes) ? notes.length : 'notes is not an array',
      hasSelectedNote: !!selectedNote, 
      selectedNoteId: selectedNote?.id || 'none',
      contentLength: currentContent?.length || 0,
      isInitialized
    });
  }, [notes, selectedNote, currentContent, isInitialized]);

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
        // Event emitted by the updateNote action
        toast.success('Note updated successfully');
      } else {
        console.log('Creating new note');
        addNote();
        // Event emitted by the addNote action
        toast.success('Note created successfully');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note. Please try again.');
    }
  };

  // Listen for journal-related events that should create notes
  useEffect(() => {
    const handleNoteFromHabit = (data: any) => {
      console.log('Creating note from habit:', data);
      // Implement creation of note from habit data
      // This would typically set content and then call addNote
    };
    
    eventManager.on('note:create-from-habit', handleNoteFromHabit);
    
    return () => {
      eventManager.off('note:create-from-habit', handleNoteFromHabit);
    };
  }, [addNote, updateCurrentContent]);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading notes...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <NotesEditor
        selectedNote={selectedNote}
        content={currentContent || ''}
        onChange={updateCurrentContent}
        onSave={handleSave}
        isEditing={!!selectedNote}
      />
      
      <SavedNotes
        notes={notes}
        onEditNote={selectNoteForEdit}
        onDeleteNote={deleteNote}
        onUpdateTagColor={(noteId, tagName, color) => {
          addTagToNote(noteId, tagName, color);
        }}
      />
    </div>
  );
};
