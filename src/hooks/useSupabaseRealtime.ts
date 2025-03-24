import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Note } from '@/types/notes';
import { eventManager } from '@/lib/events/EventManager';
import { Task } from '@/types/tasks';

const useSupabaseRealtime = () => {
  useEffect(() => {
    // Subscribe to changes in the notes table
    const notesSubscription = supabase
      .channel('public:notes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notes' },
        (payload) => {
          console.log('Change received!', payload)
          if (payload.eventType === 'INSERT') {
            // Emit a 'note:add' event when a new note is inserted
            eventManager.emit('note:add', payload.new as Note);
          } else if (payload.eventType === 'UPDATE') {
            // Emit a 'note:update' event when a note is updated
            // The payload.new contains the updated note data
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
            eventManager.emit('task:add', payload.new as Task);
          } else if (payload.eventType === 'UPDATE') {
            // Emit a 'task:update' event when a task is updated
            // The payload.new contains the updated task data
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
    const journalsSubscription = supabase
      .channel('public:journals')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'journals' },
        (payload) => {
          console.log('Journal change received!', payload);
          if (payload.eventType === 'INSERT') {
            // Emit a 'journal:create' event when a new journal is inserted
            eventManager.emit('journal:create', payload.new);
          } else if (payload.eventType === 'UPDATE') {
            // Emit a 'journal:update' event when a journal is updated
            // The payload.new contains the updated journal data
            const row = payload.new as any;
            eventManager.emit('journal:update', {
              id: row.id,
              updates: row.content
            });
          } else if (payload.eventType === 'DELETE') {
            // Emit a 'journal:delete' event when a journal is deleted
            eventManager.emit('journal:delete', { id: payload.old.id });
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
