
import { useState, useEffect } from "react";
import { initializeDataStore } from "@/types/core";
import { toast } from "sonner";

export const useDataInitialization = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearStorage = () => {
    console.log('Clearing localStorage');
    localStorage.clear();
    toast.success('Local storage cleared');
    window.location.reload();
  };

  useEffect(() => {
    console.log('Starting data store initialization');
    
    try {
      // Log current localStorage state
      console.log('Current localStorage state:', {
        schemaVersion: localStorage.getItem('schema-version'),
        relations: localStorage.getItem('entity-relations'),
        tagRelations: localStorage.getItem('tag-relations'),
        taskList: localStorage.getItem('taskList'),
        completedTasks: localStorage.getItem('completedTasks'),
        habitTemplates: localStorage.getItem('habit-templates')
      });

      const initialized = initializeDataStore();
      if (!initialized) {
        const errorMsg = 'Failed to initialize data store';
        console.error(errorMsg);
        setError(errorMsg);
        setShowClearButton(true);
        return;
      }
      
      // Verify core data structures exist
      const schemaVersion = localStorage.getItem('schema-version');
      const relations = localStorage.getItem('entity-relations');
      const tagRelations = localStorage.getItem('tag-relations');
      
      console.log('Core data structures:', {
        schemaVersion,
        hasRelations: !!relations,
        hasTagRelations: !!tagRelations
      });
      
      if (!schemaVersion || !relations || !tagRelations) {
        const errorMsg = 'Missing core data structures';
        console.error(errorMsg);
        setError(errorMsg);
        setShowClearButton(true);
        return;
      }

      console.log('Data store initialized successfully with schema version:', schemaVersion);
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown initialization error';
      console.error('Initialization error:', errorMsg);
      setError(errorMsg);
      setShowClearButton(true);
    }
  }, []);

  return { isInitialized, showClearButton, clearStorage, error };
};
