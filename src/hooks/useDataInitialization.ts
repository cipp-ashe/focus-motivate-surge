
import { useState, useEffect } from "react";
import { initializeDataStore } from "@/types/core";
import { toast } from "sonner";

export const useDataInitialization = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      console.log('Starting data store initialization');
      const initialized = initializeDataStore();
      if (!initialized) {
        console.error('Failed to initialize data store');
        toast.error('Failed to initialize data store');
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
        console.error('Missing core data structures');
        toast.error('Missing core data structures');
        return;
      }

      console.log('Data store initialized with schema version:', schemaVersion);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error during initialization:', error);
      toast.error('Error during initialization');
    }
  }, []);

  return { isInitialized };
};
