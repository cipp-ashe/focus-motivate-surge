
import { useState, useEffect } from "react";
import { initializeDataStore } from "@/types/core";
import { toast } from "sonner";

export const useDataInitialization = () => {
  const [status, setStatus] = useState<{
    isInitialized: boolean;
    error: string | null;
  }>({
    isInitialized: false,
    error: null
  });

  useEffect(() => {
    const requiredKeys = [
      'schema-version',
      'entity-relations',
      'tag-relations'
    ];

    const missingKeys = requiredKeys.filter(key => !localStorage.getItem(key));

    if (missingKeys.length > 0) {
      console.log('Initializing missing data:', missingKeys);
      const initialized = initializeDataStore();
      
      if (!initialized) {
        const error = `Failed to initialize: ${missingKeys.join(', ')}`;
        console.error(error);
        toast.error(error);
        setStatus({ isInitialized: false, error });
        return;
      }
    }

    setStatus({ isInitialized: true, error: null });
  }, []);

  const clearStorage = () => {
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
  };

  return {
    isInitialized: status.isInitialized,
    error: status.error,
    clearStorage,
    showClearButton: !!status.error
  };
};
