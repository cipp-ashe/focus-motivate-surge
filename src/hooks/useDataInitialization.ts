
import { useState, useEffect } from "react";
import { initializeDataStore } from "@/types/core";
import { toast } from "sonner";

export const useDataInitialization = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('Starting data store initialization');
        
        // Log current localStorage state
        console.log('Current localStorage state:', {
          schemaVersion: localStorage.getItem('schema-version'),
          relations: localStorage.getItem('entity-relations'),
          tagRelations: localStorage.getItem('tag-relations'),
          taskList: localStorage.getItem('taskList'),
          completedTasks: localStorage.getItem('completedTasks'),
          habitTemplates: localStorage.getItem('habit-templates')
        });

        // Clear corrupted data if needed
        const clearStorage = () => {
          console.log('Clearing localStorage');
          localStorage.clear();
          toast.success('Local storage cleared. Please refresh the page.');
          window.location.reload();
        };

        // Add clear storage button if initialization fails
        if (!isInitialized) {
          const clearButton = document.createElement('button');
          clearButton.innerHTML = 'Clear Storage & Refresh';
          clearButton.style.position = 'fixed';
          clearButton.style.top = '10px';
          clearButton.style.right = '10px';
          clearButton.style.padding = '8px';
          clearButton.style.background = '#ef4444';
          clearButton.style.color = 'white';
          clearButton.style.borderRadius = '4px';
          clearButton.onclick = clearStorage;
          document.body.appendChild(clearButton);
        }

        const initialized = initializeDataStore();
        if (!initialized) {
          console.error('Failed to initialize data store');
          toast.error('Failed to initialize data store. Try clearing storage.');
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
          toast.error('Missing core data structures. Try clearing storage.');
          return;
        }

        console.log('Data store initialized successfully with schema version:', schemaVersion);
        setIsInitialized(true);
        
        // Remove clear button if initialization succeeds
        const clearButton = document.querySelector('button');
        if (clearButton) {
          clearButton.remove();
        }
      } catch (error) {
        console.error('Error during initialization:', error);
        toast.error('Error during initialization. Try clearing storage.');
      }
    };

    initialize();
  }, [isInitialized]);

  return { isInitialized };
};
