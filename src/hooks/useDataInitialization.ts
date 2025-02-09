
import { useState, useEffect } from "react";
import { initializeDataStore } from "@/types/core";
import { toast } from "sonner";

export const useDataInitialization = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearStorage = () => {
    localStorage.clear();
    toast.success('Local storage cleared');
    window.location.reload();
  };

  useEffect(() => {
    console.log('Starting initialization check...');
    
    try {
      // Log current localStorage state for debugging
      console.log('Current localStorage state:', {
        schemaVersion: localStorage.getItem('schema-version'),
        relations: localStorage.getItem('entity-relations'),
        tagRelations: localStorage.getItem('tag-relations')
      });

      // Try to initialize if not already done
      const initialized = initializeDataStore();
      console.log('initializeDataStore() result:', initialized);

      if (!initialized) {
        console.error('Failed to initialize data store');
        setError('Failed to initialize data store');
        setShowClearButton(true);
        return;
      }
      
      // Verify core data structures exist
      const schemaVersion = localStorage.getItem('schema-version');
      const relations = localStorage.getItem('entity-relations');
      const tagRelations = localStorage.getItem('tag-relations');
      
      console.log('Core data structures after initialization:', {
        schemaVersion,
        hasRelations: !!relations,
        hasTagRelations: !!tagRelations
      });
      
      if (!schemaVersion || !relations || !tagRelations) {
        const missingItems = [];
        if (!schemaVersion) missingItems.push('schema-version');
        if (!relations) missingItems.push('entity-relations');
        if (!tagRelations) missingItems.push('tag-relations');
        
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
