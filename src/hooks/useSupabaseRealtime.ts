
import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { eventManager } from '@/lib/events/EventManager';
import { useAuth } from '@/contexts/auth/AuthContext';
import { TimerEventType } from '@/types/events';

export const useSupabaseRealtime = () => {
  const { user } = useAuth();
  const channelsRef = useRef<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Clean up function to remove channels on unmount
    const cleanupChannels = () => {
      channelsRef.current.forEach(channel => {
        supabase.removeChannel(channel);
      });
      channelsRef.current = [];
    };

    // Clear existing channels
    cleanupChannels();

    // Tasks channel
    const tasksChannel = supabase.channel('public:tasks')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('New task created:', payload);
        eventManager.emit('task:create', payload.new);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('Task updated:', payload);
        eventManager.emit('task:update', { 
          taskId: payload.new.id, 
          updates: payload.new 
        });
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('Task deleted:', payload);
        eventManager.emit('task:delete', { 
          taskId: payload.old.id, 
          reason: 'database-sync' 
        });
      })
      .subscribe();

    channelsRef.current.push(tasksChannel);

    // Habit templates channel
    const templatesChannel = supabase.channel('public:habit_templates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'habit_templates',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('New template created:', payload);
        const templateData = {
          templateId: payload.new.id,
          name: payload.new.name,
          description: payload.new.description,
          activeDays: payload.new.days,
          isActive: payload.new.is_active,
          habits: JSON.parse(payload.new.habits || '[]'),
        };
        eventManager.emit('habit:template-add', templateData);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'habit_templates',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('Template updated:', payload);
        eventManager.emit('habit:template-update', payload.new);
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'habit_templates',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('Template deleted:', payload);
        eventManager.emit('habit:template-delete', { 
          templateId: payload.old.id,
          isOriginatingAction: false
        });
      })
      .subscribe();

    channelsRef.current.push(templatesChannel);

    // Notes channel
    const notesChannel = supabase.channel('public:notes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notes',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('New note created:', payload);
        eventManager.emit('note:create', payload.new);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'notes',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('Note updated:', payload);
        eventManager.emit('note:update', { 
          noteId: payload.new.id, 
          updates: payload.new 
        });
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'notes',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('Note deleted:', payload);
        eventManager.emit('note:delete', payload.old.id);
      })
      .subscribe();

    channelsRef.current.push(notesChannel);

    // Events channel for handling custom events
    const eventsChannel = supabase.channel('public:events')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'events',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('New event received:', payload);
        try {
          const eventData = payload.new;
          if (!eventData.processed) {
            // Emit the event locally
            eventManager.emit(eventData.event_type as TimerEventType, eventData.payload);
            
            // Mark as processed
            supabase
              .from('events')
              .update({ processed: true })
              .eq('id', eventData.id)
              .then(({ error }) => {
                if (error) console.error('Error marking event as processed:', error);
              });
          }
        } catch (error) {
          console.error('Error processing realtime event:', error);
        }
      })
      .subscribe();

    channelsRef.current.push(eventsChannel);

    // Clean up on unmount
    return cleanupChannels;
  }, [user]);
};
