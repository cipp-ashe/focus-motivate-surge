
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Note } from '@/types/notes';
import { eventManager } from '@/lib/events/EventManager';
import { Task } from '@/types/tasks';
import { JournalEntry } from '@/types/events';

const useSupabaseRealtime = () => {
  useEffect(() => {
    // Subscribe to changes in the notes table
    const notesSubscription = supabase
      .channel('public:notes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notes' },
        (payload) => {
          console.log('Note change received!', payload)
          if (payload.eventType === 'INSERT') {
            // Emit a 'note:add' event when a new note is inserted
            eventManager.emit('note:add', { note: payload.new as Note });
          } else if (payload.eventType === 'UPDATE') {
            // Emit a 'note:update' event when a note is updated
            eventManager.emit('note:update', {
              id: payload.new.id,
              updates: payload.new
            });
          } else if (payload.eventType === 'DELETE') {
            // Emit a 'note:delete' event when a note is deleted
            eventManager.emit('note:delete', { id: payload.old.id });
          }
        }
      )
      .subscribe()

    // Subscribe to changes in the tasks table
    const tasksSubscription = supabase
      .channel('public:tasks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          console.log('Task change received!', payload)
          if (payload.eventType === 'INSERT') {
            // Emit a 'task:add' event when a new task is inserted
            eventManager.emit('task:add', { task: payload.new as Task });
          } else if (payload.eventType === 'UPDATE') {
            // Emit a 'task:update' event when a task is updated
            eventManager.emit('task:update', {
              taskId: payload.new.id,
              updates: payload.new
            });
          } else if (payload.eventType === 'DELETE') {
            // Emit a 'task:delete' event when a task is deleted
            eventManager.emit('task:delete', { taskId: payload.old.id });
          }
        }
      )
      .subscribe()

    // Fetch initial data and set up real-time subscription for journals
    // (journals will be handled as specialized notes in our system)
    const journalsSubscription = supabase
      .channel('public:journals')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'journals' },
        (payload) => {
          console.log('Journal change received!', payload);
          const data = payload.new || payload.old;
          
          // Check if it has journal-specific properties
          const isJournal = data && (data.habitId || data.taskId);
          
          if (payload.eventType === 'INSERT') {
            // If it's a journal-specific entry, emit both journal and note events
            if (isJournal) {
              eventManager.emit('journal:create', payload.new);
              // Also emit a note:add event with the journal as a note
              eventManager.emit('note:add', { note: payload.new as Note });
            } else {
              // Just a regular note
              eventManager.emit('note:add', { note: payload.new as Note });
            }
          } else if (payload.eventType === 'UPDATE') {
            // Handle updates
            const row = payload.new as any;
            
            if (isJournal) {
              eventManager.emit('journal:update', {
                id: row.id,
                updates: row
              });
            }
            
            // Always emit note update for any type of note
            eventManager.emit('note:update', {
              id: row.id,
              updates: row
            });
          } else if (payload.eventType === 'DELETE') {
            // Handle deletion
            if (isJournal) {
              eventManager.emit('journal:delete', { id: payload.old.id });
            }
            
            // Always emit note deletion event
            eventManager.emit('note:delete', { id: payload.old.id });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notesSubscription)
      supabase.removeChannel(tasksSubscription)
      supabase.removeChannel(journalsSubscription)
    }
  }, [])
}

export default useSupabaseRealtime
