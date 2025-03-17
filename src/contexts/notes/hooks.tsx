
import { useCallback } from 'react';
import { useNoteState, useNoteDispatch } from './NoteContext';
import { Note } from '@/types/notes';
import { eventManager } from '@/lib/events/EventManager';
import { NoteEventType } from '@/lib/events/types';

export const useNoteActions = () => {
  const dispatch = useNoteDispatch();
  const { selected, content } = useNoteState();

  const updateCurrentContent = useCallback((content: string) => {
    dispatch({ type: 'UPDATE_CURRENT_CONTENT', payload: content });
  }, [dispatch]);

  const selectNoteForEdit = useCallback((note: Note) => {
    dispatch({ type: 'SELECT_NOTE', payload: note });
    
    // Also emit an event for other parts of the app
    eventManager.emit('note:view' as NoteEventType, { 
      id: note.id,
      title: note.title || 'Untitled Note'
    });
  }, [dispatch]);

  const addNote = useCallback(() => {
    if (!content?.trim()) return;

    const newNote: Note = {
      id: crypto.randomUUID(),
      title: content.split('\n')[0]?.trim().replace(/^#+ /, '') || 'Untitled Note',
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: []
    };

    dispatch({ type: 'ADD_NOTE', payload: newNote });
    dispatch({ type: 'SELECT_NOTE', payload: null });
    dispatch({ type: 'UPDATE_CURRENT_CONTENT', payload: '' });
    
    // Emit event for other components
    eventManager.emit('note:create', { 
      id: newNote.id, 
      title: newNote.title, 
      content: newNote.content 
    });
  }, [content, dispatch]);

  const updateNote = useCallback((id: string, newContent: string) => {
    if (!id || !newContent.trim()) return;

    const updatedNote: Partial<Note> = {
      content: newContent,
      title: newContent.split('\n')[0]?.trim().replace(/^#+ /, '') || 'Untitled Note',
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: 'UPDATE_NOTE', payload: { id, updates: updatedNote } });
    dispatch({ type: 'SELECT_NOTE', payload: null });
    dispatch({ type: 'UPDATE_CURRENT_CONTENT', payload: '' });
    
    // Emit event for other components
    eventManager.emit('note:update', { 
      id, 
      updates: updatedNote
    });
  }, [dispatch]);

  const deleteNote = useCallback((id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: id });
    if (selected?.id === id) {
      dispatch({ type: 'SELECT_NOTE', payload: null });
      dispatch({ type: 'UPDATE_CURRENT_CONTENT', payload: '' });
    }
    
    // Emit event for other components
    eventManager.emit('note:deleted' as NoteEventType, { 
      id 
    });
  }, [dispatch, selected?.id]);

  const addTagToNote = useCallback((noteId: string, tagName: string, tagColor?: string) => {
    dispatch({
      type: 'ADD_TAG_TO_NOTE',
      payload: { noteId, tagName, tagColor }
    });
  }, [dispatch]);

  const removeTagFromNote = useCallback((noteId: string, tagId: string) => {
    dispatch({
      type: 'REMOVE_TAG_FROM_NOTE',
      payload: { noteId, tagId }
    });
  }, [dispatch]);

  const clearCurrentNote = useCallback(() => {
    dispatch({ type: 'SELECT_NOTE', payload: null });
    dispatch({ type: 'UPDATE_CURRENT_CONTENT', payload: '' });
  }, [dispatch]);

  return {
    updateCurrentContent,
    selectNoteForEdit,
    addNote,
    updateNote,
    deleteNote,
    addTagToNote,
    removeTagFromNote,
    clearCurrentNote
  };
};
