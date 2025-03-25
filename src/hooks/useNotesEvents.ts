
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { Note, NoteTag } from '@/types/notes';

/**
 * Hook for note-related events
 */
export const useNotesEvents = () => {
  // Subscribe to events
  const onNoteCreate = useCallback((callback: (note: Note) => void) => {
    return eventManager.on('note:create', callback);
  }, []);

  const onNoteUpdate = useCallback((callback: (data: { id: string, updates: Partial<Note> }) => void) => {
    return eventManager.on('note:update', callback);
  }, []);

  const onNoteDelete = useCallback((callback: (data: { id: string, reason?: string }) => void) => {
    return eventManager.on('note:delete', callback);
  }, []);

  const onNoteSelect = useCallback((callback: (noteId: string | null) => void) => {
    return eventManager.on('note:select', callback);
  }, []);

  const onNoteTagsUpdate = useCallback((callback: (data: { noteId: string, tags: NoteTag[] }) => void) => {
    return eventManager.on('note:tags:update', callback);
  }, []);
  
  const onNotesRefresh = useCallback((callback: () => void) => {
    return eventManager.on('notes:refresh', callback);
  }, []);

  // Emit events
  const createNote = useCallback((note: Note) => {
    eventManager.emit('note:create', note);
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    eventManager.emit('note:update', { id, updates });
  }, []);

  const deleteNote = useCallback((id: string, reason?: string) => {
    eventManager.emit('note:delete', { id, reason });
  }, []);

  const selectNote = useCallback((noteId: string | null) => {
    eventManager.emit('note:select', noteId);
  }, []);

  const updateNoteTags = useCallback((noteId: string, tags: NoteTag[]) => {
    eventManager.emit('note:tags:update', { noteId, tags });
  }, []);
  
  const archiveNote = useCallback((id: string) => {
    eventManager.emit('note:archive', { id });
  }, []);
  
  const unarchiveNote = useCallback((id: string) => {
    eventManager.emit('note:unarchive', { id });
  }, []);
  
  const pinNote = useCallback((id: string) => {
    eventManager.emit('note:pin', { id });
  }, []);
  
  const unpinNote = useCallback((id: string) => {
    eventManager.emit('note:unpin', { id });
  }, []);
  
  const refreshNotes = useCallback(() => {
    eventManager.emit('notes:refresh', undefined);
  }, []);

  return {
    // Event subscriptions
    onNoteCreate,
    onNoteUpdate,
    onNoteDelete,
    onNoteSelect,
    onNoteTagsUpdate,
    onNotesRefresh,
    
    // Event emitters
    createNote,
    updateNote,
    deleteNote,
    selectNote,
    updateNoteTags,
    archiveNote,
    unarchiveNote,
    pinNote,
    unpinNote,
    refreshNotes
  };
};
