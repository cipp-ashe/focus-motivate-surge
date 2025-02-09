
import { useState, useEffect } from "react";
import { initializeDataStore } from "@/types/core";
import { toast } from "sonner";

export const useDataInitialization = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearStorage = () => {
    try {
      // Clear only specific keys instead of all localStorage
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
    } catch (err) {
      console.error('Error clearing storage:', err);
      toast.error('Failed to clear storage');
    }
  };

  useEffect(() => {
    console.log('Starting initialization check...');
    
    try {
      // Verify core data structures exist
      const schemaVersion = localStorage.getItem('schema-version');
      const relations = localStorage.getItem('entity-relations');
      const tagRelations = localStorage.getItem('tag-relations');

      // Try to initialize if needed
      if (!schemaVersion || !relations || !tagRelations) {
        console.log('Core data missing, attempting initialization...');
        const initialized = initializeDataStore();
        
        if (!initialized) {
          console.error('Failed to initialize data store');
          setError('Failed to initialize data store');
          setShowClearButton(true);
          return;
        }
      }

      // Verify initialization worked
      const finalSchemaVersion = localStorage.getItem('schema-version');
      const finalRelations = localStorage.getItem('entity-relations');
      const finalTagRelations = localStorage.getItem('tag-relations');

      if (!finalSchemaVersion || !finalRelations || !finalTagRelations) {
        const missingItems = [];
        if (!finalSchemaVersion) missingItems.push('schema-version');
        if (!finalRelations) missingItems.push('entity-relations');
        if (!finalTagRelations) missingItems.push('tag-relations');
        
        const errorMsg = `Missing required data: ${missingItems.join(', ')}`;
        console.error(errorMsg);
        setError(errorMsg);
        setShowClearButton(true);
        return;
      }

      console.log('Initialization successful');
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown initialization error';
      console.error('Initialization error:', errorMsg);
      setError(errorMsg);
      setShowClearButton(true);
    }
  }, []); // Only run once on mount

  return { isInitialized, showClearButton, clearStorage, error };
};
