
import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { eventManager } from '@/lib/events/EventManager';
import { useAuth } from '@/contexts/auth/AuthContext';
import { AllEventTypes, NoteEventType } from '@/lib/events/types';
import { Task } from '@/types/tasks';

export const useSupabaseRealtime = () => {
  const { user } = useAuth();
  const channelsRef = useRef<any[]>([]);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Only set up channels if user is authenticated and we haven't initialized yet
    if (!user || isInitializedRef.current) return;
    
    isInitializedRef.current = true;
    console.log("Setting up Supabase realtime channels");

    // Clean up function to remove channels on unmount
    const cleanupChannels = () => {
      channelsRef.current.forEach(channel => {
        supabase.removeChannel(channel);
      });
      channelsRef.current = [];
      isInitializedRef.current = false;
    };

    // Set up a single combined channel for all tables
    try {
      const combinedChannel = supabase.channel('public-changes')
        // Tasks
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'tasks',
          filter: user ? `user_id=eq.${user.id}` : undefined
        }, (payload) => {
          console.log('New task created:', payload);
          // Fix: Cast payload to ensure required Task properties
          const taskData = payload.new as Task;
          eventManager.emit('task:create', taskData);
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'tasks',
          filter: user ? `user_id=eq.${user.id}` : undefined
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
          filter: user ? `user_id=eq.${user.id}` : undefined
        }, (payload) => {
          console.log('Task deleted:', payload);
          eventManager.emit('task:delete', { 
            taskId: payload.old.id, 
            reason: 'database-sync' 
          });
        })
        // Habit templates
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'habit_templates',
          filter: user ? `user_id=eq.${user.id}` : undefined
        }, (payload) => {
          console.log('New template created:', payload);
          // Fix: Provide the templateId property explicitly
          eventManager.emit('habit:template-add', { templateId: payload.new.id });
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'habit_templates',
          filter: user ? `user_id=eq.${user.id}` : undefined
        }, (payload) => {
          console.log('Template updated:', payload);
          eventManager.emit('habit:template-update', payload.new);
        })
        .on('postgres_changes', {
          event: 'DELETE',
          schema: 'public',
          table: 'habit_templates',
          filter: user ? `user_id=eq.${user.id}` : undefined
        }, (payload) => {
          console.log('Template deleted:', payload);
          eventManager.emit('habit:template-delete', { 
            templateId: payload.old.id,
            isOriginatingAction: false
          });
        })
        // Notes
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notes',
          filter: user ? `user_id=eq.${user.id}` : undefined
        }, (payload) => {
          console.log('New note created:', payload);
          // Fix: Ensure required properties are present
          eventManager.emit('note:create', {
            id: payload.new.id,
            title: payload.new.title || 'Untitled',
            content: payload.new.content || ''
          });
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'notes',
          filter: user ? `user_id=eq.${user.id}` : undefined
        }, (payload) => {
          console.log('Note updated:', payload);
          // Fix: Use proper id property
          eventManager.emit('note:update', { 
            id: payload.new.id, 
            updates: payload.new 
          });
        })
        .on('postgres_changes', {
          event: 'DELETE',
          schema: 'public',
          table: 'notes',
          filter: user ? `user_id=eq.${user.id}` : undefined
        }, (payload) => {
          console.log('Note deleted:', payload);
          // Use 'note:deleted' which is the correct event name in our types
          eventManager.emit('note:deleted' as NoteEventType, { id: payload.old.id });
        })
        // Events
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'events',
          filter: user ? `user_id=eq.${user.id}` : undefined
        }, (payload) => {
          console.log('New event received:', payload);
          try {
            const eventData = payload.new;
            if (!eventData.processed) {
              // Emit the event locally - cast to AllEventTypes to maintain type safety
              eventManager.emit(eventData.event_type as AllEventTypes, eventData.payload);
              
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

      channelsRef.current.push(combinedChannel);
      console.log('Supabase realtime channel established');
    } catch (error) {
      console.error('Error setting up Supabase realtime:', error);
    }

    // Clean up on unmount
    return cleanupChannels;
  }, [user]);
};
