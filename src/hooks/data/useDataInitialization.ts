
import { useState, useEffect } from "react";
import { initializeDataStore } from "@/types/core";
import { toast } from "sonner";
import { eventBus } from "@/lib/eventBus";
import { eventManager } from "@/lib/events/EventManager";

export const useDataInitialization = () => {
  const [status, setStatus] = useState<{
    isInitialized: boolean;
    error: string | null;
  }>({
    isInitialized: false,
    error: null
  });

  useEffect(() => {
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
      
      // Emit event to trigger task loading after initialization
      setTimeout(() => {
        console.log("Emitting force-task-update event after initialization");
        window.dispatchEvent(new Event('force-task-update'));
        
        // Also emit via both event systems for maximum compatibility
        eventBus.emit('app:initialized', {});
        eventManager.emit('app:initialized', {});
      }, 100);
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
    showClearButton: true // Always show clear button to help users who are stuck
  };
};
