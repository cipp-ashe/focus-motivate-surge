
import { useState, useEffect, useRef } from "react";
import { initializeDataStore } from "@/types/core";
import { toast } from "sonner";
import { eventManager } from "@/lib/events/EventManager";

// Global flags to prevent duplicate initialization and event emissions
let globalInitialized = false;
let eventsEmitted = false;

export const useDataInitialization = () => {
  const [status, setStatus] = useState<{
    isInitialized: boolean;
    error: string | null;
  }>({
    isInitialized: globalInitialized,
    error: null
  });
  
  const initRunRef = useRef(false);

  useEffect(() => {
    // Skip if already initialized globally
    if (globalInitialized) {
      setStatus({ isInitialized: true, error: null });
      return;
    }
    
    // Skip if already initialized locally
    if (initRunRef.current) return;
    initRunRef.current = true;
    
    console.log("Starting data initialization check");
    
    try {
      // Fast check for required schema
      const requiredKeys = ['schema-version', 'entity-relations', 'tag-relations'];
      const missingKeys = requiredKeys.filter(key => !localStorage.getItem(key));
      
      if (missingKeys.length > 0) {
        initializeDataStore();
      }

      // Mark as initialized
      console.log("Data initialization complete");
      setStatus({ isInitialized: true, error: null });
      globalInitialized = true;
      
      // Emit event to trigger task loading - do this only once globally
      if (!eventsEmitted) {
        eventsEmitted = true;
        
        // Use a short timeout and emit just once
        setTimeout(() => {
          console.log("Emitting initialization events (once)");
          eventManager.emit('app:initialized', {
            timestamp: new Date().toISOString()
          });
          window.dispatchEvent(new CustomEvent('force-task-update'));
        }, 100);
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
        'schema-version', 'entity-relations', 'tag-relations',
        'taskList', 'completedTasks', 'favoriteQuotes',
        'habit-templates', 'lastSyncDate', 'notes'
      ];

      keysToRemove.forEach(key => localStorage.removeItem(key));
      toast.success('Application data cleared');
      globalInitialized = false;
      eventsEmitted = false;
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
