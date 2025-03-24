
import React, { useEffect, useState } from 'react';
import { NotesEditor } from './NotesEditor';
import { SavedNotes } from './SavedNotes';
import { toast } from 'sonner';
import { useNoteActions, useNoteState } from '@/contexts/notes/NoteContext';
import { eventManager } from '@/lib/events/EventManager';

export const Notes = () => {
  // Use state to track initialization
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use the note context
  const { notes, selectedNoteId } = useNoteState();
  const { 
    addNote, 
    updateNote, 
    deleteNote,
    selectNote
  } = useNoteActions();
  
  // Local state to hold current content being edited
  const [currentContent, setCurrentContent] = useState("");
  
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
      hasSelectedNote: !!selectedNoteId, 
      selectedNoteId: selectedNoteId || 'none',
      contentLength: currentContent?.length || 0,
      isInitialized
    });
  }, [notes, selectedNoteId, currentContent, isInitialized]);

  // Helper function to update current content
  const updateCurrentContent = (content: string) => {
    setCurrentContent(content);
  };
  
  // Helper function to select a note for editing
  const selectNoteForEdit = (note: any) => {
    selectNote(note.id);
    setCurrentContent(note.content);
  };

  const handleSave = () => {
    console.log('Attempting to save note', { 
      hasSelectedNote: !!selectedNoteId,
      contentValid: !!currentContent?.trim()
    });
    
    if (!currentContent?.trim()) {
      console.log('Cannot save empty note');
      toast.error('Cannot save empty note');
      return;
    }
    
    try {
      if (selectedNoteId) {
        console.log('Updating existing note:', selectedNoteId);
        updateNote(selectedNoteId, { content: currentContent });
        selectNote(null);
        setCurrentContent("");
        toast.success('Note updated successfully');
      } else {
        console.log('Creating new note');
        addNote({ content: currentContent });
        setCurrentContent("");
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
      if (data && data.content && data.habitId) {
        addNote({ 
          content: data.content,
          title: `Journal: ${data.habitName || 'Habit'}`,
          tags: [{ name: 'journal', color: 'blue' }],
          relationships: [{
            entityId: data.habitId,
            entityType: 'habit'
          }]
        });
      }
    };
    
    eventManager.on('note:create-from-habit', handleNoteFromHabit);
    
    return () => {
      eventManager.off('note:create-from-habit', handleNoteFromHabit);
    };
  }, [addNote]);

  // Find selected note
  const selectedNote = selectedNoteId 
    ? notes.find(note => note.id === selectedNoteId) 
    : null;

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
        content={currentContent}
        onChange={updateCurrentContent}
        onSave={handleSave}
        isEditing={!!selectedNoteId}
      />
      
      <SavedNotes
        notes={notes}
        onEditNote={selectNoteForEdit}
        onDeleteNote={deleteNote}
        onUpdateTagColor={(noteId, tagName, color) => {
          updateNote(noteId, { 
            tags: selectedNote?.tags?.map(tag => 
              tag.name === tagName ? { ...tag, color } : tag
            ) || []
          });
        }}
      />
    </div>
  );
};
