
/**
 * User Preferences Hook
 * 
 * Provides access to user preferences and settings
 */

import { useState, useEffect } from 'react';

interface UserPreferences {
  darkMode: boolean;
  colorScheme: string;
  fontSize: 'sm' | 'md' | 'lg';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  showCompletedTasks: boolean;
  autoSave: boolean;
  defaultTaskDuration: number;
  defaultView: 'tasks' | 'habits' | 'notes' | 'journal';
  [key: string]: any;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  darkMode: false,
  colorScheme: 'blue',
  fontSize: 'md',
  soundEnabled: true,
  notificationsEnabled: true,
  showCompletedTasks: true,
  autoSave: true,
  defaultTaskDuration: 25,
  defaultView: 'tasks'
};

const STORAGE_KEY = 'user-preferences';

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const storedPreferences = localStorage.getItem(STORAGE_KEY);
      return storedPreferences 
        ? { ...DEFAULT_PREFERENCES, ...JSON.parse(storedPreferences) }
        : DEFAULT_PREFERENCES;
    } catch (error) {
      console.error('Error loading user preferences:', error);
      return DEFAULT_PREFERENCES;
    }
  });

  // Persist preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }, [preferences]);

  // Update a single preference
  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset preferences to defaults
  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  // Get a specific preference with fallback
  const getPreference = <K extends keyof UserPreferences>(
    key: K,
    fallback?: UserPreferences[K]
  ): UserPreferences[K] => {
    return preferences[key] ?? fallback ?? DEFAULT_PREFERENCES[key];
  };

  return {
    preferences,
    updatePreference,
    resetPreferences,
    getPreference
  };
}

export default useUserPreferences;
