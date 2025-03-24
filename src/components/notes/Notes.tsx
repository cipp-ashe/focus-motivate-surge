
import React, { useEffect, useState } from 'react';
import { NotesEditor } from './NotesEditor';
import { SavedNotes } from './SavedNotes';
import { toast } from 'sonner';
import { useNoteActions, useNoteState } from '@/contexts/notes/hooks';
import { eventManager } from '@/lib/events/EventManager';
import { Note, Tag, TagColor } from '@/types/notes';
import { EntityType } from '@/types/core';

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
  const selectNoteForEdit = (note: Note) => {
    selectNote(note.id);
    setCurrentContent(note.content);
  };

  // Add and remove tags from notes
  const addTagToNote = (noteId: string, tagName: string, tagColor: TagColor) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    const existingTag = note.tags.find(t => t.name === tagName);
    if (existingTag) return;
    
    const updatedTags = [...note.tags, { name: tagName, color: tagColor }];
    updateNote(noteId, { tags: updatedTags });
  };
  
  const removeTagFromNote = (noteId: string, tagName: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    const updatedTags = note.tags.filter(t => t.name !== tagName);
    updateNote(noteId, { tags: updatedTags });
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
        const now = new Date().toISOString();
        addNote({ 
          title: 'Untitled Note', 
          content: currentContent,
          tags: [],
          createdAt: now,
          updatedAt: now
        });
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
    const handleJournalCreate = (data: any) => {
      console.log('Creating note from journal event:', data);
      if (data && (data.habitId || data.taskId)) {
        const now = new Date().toISOString();
        const relationships = [];
        
        // Add habit relationship if present
        if (data.habitId) {
          relationships.push({
            entityId: data.habitId,
            entityType: EntityType.Habit,
            metadata: {
              templateId: data.templateId,
              date: data.date || now
            }
          });
        }
        
        // Add task relationship if present
        if (data.taskId) {
          relationships.push({
            entityId: data.taskId,
            entityType: EntityType.Task,
            metadata: {
              date: data.date || now
            }
          });
        }
        
        // Create tags for the note
        const tags = [{ name: 'journal', color: 'blue' as TagColor }];
        
        // Add the note
        addNote({ 
          content: data.content || '',
          title: `Journal: ${data.habitName || data.title || 'Entry'}`,
          tags,
          relationships,
          createdAt: now,
          updatedAt: now
        });
      }
    };
    
    // Handle habit notes
    const handleNoteFromHabit = (data: any) => {
      console.log('Creating note from habit:', data);
      if (data && data.habitId) {
        const now = new Date().toISOString();
        
        addNote({ 
          content: data.content || '',
          title: `Journal: ${data.habitName || 'Habit'}`,
          tags: [{ name: 'journal', color: 'blue' as TagColor }],
          relationships: [{
            entityId: data.habitId,
            entityType: EntityType.Habit,
            metadata: {
              templateId: data.templateId,
              date: now
            }
          }],
          createdAt: now,
          updatedAt: now
        });
      }
    };
    
    // Subscribe to both journal events and notes from habits
    eventManager.on('journal:create', handleJournalCreate);
    eventManager.on('note:create-from-habit', handleNoteFromHabit);
    
    return () => {
      eventManager.off('journal:create', handleJournalCreate);
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
          const note = notes.find(n => n.id === noteId);
          if (note) {
            updateNote(noteId, { 
              tags: note.tags.map(tag => 
                tag.name === tagName ? { ...tag, color } : tag
              ) 
            });
          }
        }}
      />
    </div>
  );
};
