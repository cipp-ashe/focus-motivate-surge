
import { useState, useEffect } from "react";
import { initializeDataStore } from "@/types/core";
import { toast } from "sonner";

export const useDataInitialization = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);

  const clearStorage = () => {
    console.log('Clearing localStorage');
    localStorage.clear();
    toast.success('Local storage cleared');
    window.location.reload();
  };

  useEffect(() => {
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

    const initialized = initializeDataStore();
    if (!initialized) {
      console.error('Failed to initialize data store');
      toast.error('Failed to initialize data store. Try clearing storage.');
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
      console.error('Missing core data structures');
      toast.error('Missing core data structures. Try clearing storage.');
      setShowClearButton(true);
      return;
    }

    console.log('Data store initialized successfully with schema version:', schemaVersion);
    setIsInitialized(true);
  }, []); // Remove isInitialized from dependencies

  return { isInitialized, showClearButton, clearStorage };
};
