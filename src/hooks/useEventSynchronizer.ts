
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { eventManager } from '@/lib/events/EventManager';
import { TimerEventType } from '@/types/events';

/**
 * Hook to synchronize events between local state and Supabase
 * This helps ensure events are processed even if the user is offline
 */
export const useEventSynchronizer = () => {
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Poll for events periodically and process them
  useEffect(() => {
    if (!user) return;
    
    const syncEvents = async () => {
      if (isSyncing || !user) return;
      
      try {
        setIsSyncing(true);
        
        // Fetch unprocessed events
        const events = await eventManager.fetchEvents(20);
        
        if (events.length > 0) {
          console.log(`Processing ${events.length} unprocessed events`);
          
          // Track which events were successfully processed
          const processedEventIds: string[] = [];
          
          // Process each event
          for (const event of events) {
            try {
              // Emit the event locally
              eventManager.emit(event.event_type as TimerEventType, event.payload);
              processedEventIds.push(event.id);
            } catch (err) {
              console.error(`Error processing event ${event.id}:`, err);
            }
          }
          
          // Mark successfully processed events
          if (processedEventIds.length > 0) {
            await eventManager.markEventsAsProcessed(processedEventIds);
            console.log(`Marked ${processedEventIds.length} events as processed`);
          }
        }
      } catch (error) {
        console.error('Error during event synchronization:', error);
      } finally {
        setIsSyncing(false);
      }
    };
    
    // Initial sync
    syncEvents();
    
    // Set up interval for regular syncing
    syncIntervalRef.current = setInterval(syncEvents, 60000); // Every minute
    
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [user, isSyncing]);
  
  return { isSyncing };
};
