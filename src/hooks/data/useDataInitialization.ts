
import { useState, useEffect, useRef } from "react";
import { initializeDataStore } from "@/types/core";
import { toast } from "sonner";
import { eventBus } from "@/lib/eventBus";
import { eventManager } from "@/lib/events/EventManager";

// Global flag to prevent duplicate initialization across instances
let globalInitialized = false;

export const useDataInitialization = () => {
  const [status, setStatus] = useState<{
    isInitialized: boolean;
    error: string | null;
  }>({
    isInitialized: false,
    error: null
  });
  
  const initRunRef = useRef(false);
  const eventsEmittedRef = useRef(false);

  useEffect(() => {
    // First check the global flag
    if (globalInitialized) {
      setStatus({ isInitialized: true, error: null });
      return;
    }
    
    // Then check the local ref
    if (initRunRef.current) return;
    initRunRef.current = true;
    
    try {
      console.log("Starting data initialization check");
      const requiredKeys = [
        'schema-version',
        'entity-relations',
        'tag-relations'
      ];

      const missingKeys = requiredKeys.filter(key => !localStorage.getItem(key));
      
      if (missingKeys.length > 0) {
        console.log('Initializing missing data:', missingKeys);
        try {
          const initialized = initializeDataStore();
          
          if (!initialized) {
            const error = `Failed to initialize: ${missingKeys.join(', ')}`;
            console.error(error);
            setStatus({ isInitialized: false, error });
            return;
          }
        } catch (initError) {
          console.error('Error during initializeDataStore:', initError);
          setStatus({ 
            isInitialized: false, 
            error: initError instanceof Error ? initError.message : 'Unknown error during initialization' 
          });
          return;
        }
      }

      // If we got here, initialization succeeded or wasn't needed
      console.log("Data initialization complete");
      setStatus({ isInitialized: true, error: null });
      globalInitialized = true;
      
      // Emit event to trigger task loading after initialization - do this only once globally
      if (!eventsEmittedRef.current) {
        eventsEmittedRef.current = true;
        
        // Use a single timeout for all events and emit only once
        setTimeout(() => {
          console.log("Emitting initialization events (once)");
          
          // Use a single event instead of multiple
          eventBus.emit('app:initialized', {});
          eventManager.emit('app:initialized', {});
          
          // Dispatch this as a regular DOM event
          window.dispatchEvent(new CustomEvent('force-task-update', { detail: { source: 'initialization' } }));
        }, 200);
      }
    } catch (error) {
      console.error('Error during data initialization:', error);
      setStatus({ 
        isInitialized: false, 
        error: error instanceof Error ? error.message : 'Unknown error during initialization' 
      });
    }
  }, []);

  const clearStorage = () => {
    try {
      const keysToRemove = [
        'schema-version',
        'entity-relations',
        'tag-relations',
        'taskList',
        'completedTasks',
        'favoriteQuotes',
        'habit-templates',
        'lastSyncDate',
        'notes'
      ];

      keysToRemove.forEach(key => localStorage.removeItem(key));
      toast.success('Application data cleared');
      globalInitialized = false; // Reset the global initialization flag
      window.location.reload();
    } catch (error) {
      console.error('Error clearing storage:', error);
      toast.error('Failed to clear application data');
    }
  };

  return {
    isInitialized: status.isInitialized,
    error: status.error,
    clearStorage,
    showClearButton: true
  };
};
