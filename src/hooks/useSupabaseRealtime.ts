
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Note } from '@/types/notes';
import { eventManager } from '@/lib/events/EventManager';
import { Task } from '@/types/tasks';
import { JournalEntry } from '@/types/events';
import { logger } from '@/utils/logManager';

const useSupabaseRealtime = () => {
  useEffect(() => {
    logger.debug('SupabaseRealtime', 'Setting up unified realtime subscription');
    
    // Use a single channel for all tables to reduce connections
    const realtimeChannel = supabase
      .channel('unified-realtime-channel')
      // Notes table subscription
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notes' },
        (payload) => {
          logger.debug('SupabaseRealtime', 'Note change received:', payload);
          if (payload.eventType === 'INSERT') {
            eventManager.emit('note:add', { note: payload.new as Note });
          } else if (payload.eventType === 'UPDATE') {
            eventManager.emit('note:update', {
              id: payload.new.id,
              updates: payload.new
            });
          } else if (payload.eventType === 'DELETE') {
            eventManager.emit('note:delete', { id: payload.old.id });
          }
        }
      )
      // Tasks table subscription
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          logger.debug('SupabaseRealtime', 'Task change received:', payload);
          if (payload.eventType === 'INSERT') {
            eventManager.emit('task:add', { task: payload.new as Task });
          } else if (payload.eventType === 'UPDATE') {
            eventManager.emit('task:update', {
              taskId: payload.new.id,
              updates: payload.new
            });
          } else if (payload.eventType === 'DELETE') {
            eventManager.emit('task:delete', { taskId: payload.old.id });
          }
        }
      )
      // Journals table subscription
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'journals' },
        (payload) => {
          logger.debug('SupabaseRealtime', 'Journal change received:', payload);
          const data = payload.new || payload.old;
          
          // Check if it has journal-specific properties
          const isJournal = data && (data.habitId || data.taskId);
          
          if (payload.eventType === 'INSERT') {
            if (isJournal) {
              eventManager.emit('journal:create', payload.new);
              eventManager.emit('note:add', { note: payload.new as Note });
            } else {
              eventManager.emit('note:add', { note: payload.new as Note });
            }
          } else if (payload.eventType === 'UPDATE') {
            const row = payload.new as any;
            
            if (isJournal) {
              eventManager.emit('journal:update', {
                id: row.id,
                updates: row
              });
            }
            
            eventManager.emit('note:update', {
              id: row.id,
              updates: row
            });
          } else if (payload.eventType === 'DELETE') {
            if (isJournal) {
              eventManager.emit('journal:delete', { id: payload.old.id });
            }
            
            eventManager.emit('note:delete', { id: payload.old.id });
          }
        }
      )
      .subscribe((status) => {
        logger.debug('SupabaseRealtime', 'Subscription status:', status);
      });

    // Clean up function
    return () => {
      logger.debug('SupabaseRealtime', 'Cleaning up realtime subscription');
      supabase.removeChannel(realtimeChannel);
    };
  }, []);
};

export default useSupabaseRealtime;
