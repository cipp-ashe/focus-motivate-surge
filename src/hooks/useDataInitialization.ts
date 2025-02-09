
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
    try {
      // Check if already initialized to prevent multiple attempts
      if (isInitialized) {
        return;
      }

      const initialized = initializeDataStore();
      if (!initialized) {
        setError('Failed to initialize data store');
        setShowClearButton(true);
        return;
      }
      
      // Verify core data structures exist
      const schemaVersion = localStorage.getItem('schema-version');
      const relations = localStorage.getItem('entity-relations');
      const tagRelations = localStorage.getItem('tag-relations');
      
      if (!schemaVersion || !relations || !tagRelations) {
        setError('Missing core data structures');
        setShowClearButton(true);
        return;
      }

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
