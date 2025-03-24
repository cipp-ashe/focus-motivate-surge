
/**
 * Application Initialization Utilities
 * 
 * This module handles application initialization processes like
 * running data migrations, checking compatibility, etc.
 */

import { runDataMigration } from './migrations/typeMigration';
import { eventManager } from '@/lib/events/EventManager';

// Local storage keys
const INITIALIZED_KEY = 'app_initialized';
const LAST_VERSION_KEY = 'app_version';

// Current application version
const CURRENT_VERSION = '2.0.0';

/**
 * Run initialization processes
 */
export function initializeApplication() {
  console.log('Running application initialization...');
  
  try {
    // Check if we've already run initialization for this version
    const lastVersion = localStorage.getItem(LAST_VERSION_KEY);
    const initialized = localStorage.getItem(INITIALIZED_KEY);
    
    // If already initialized with current version, skip
    if (initialized === 'true' && lastVersion === CURRENT_VERSION) {
      console.log('Application already initialized with current version', CURRENT_VERSION);
      return true;
    }
    
    console.log(`Initializing application version ${CURRENT_VERSION}...`);
    
    // Run data migrations
    const migrationResult = runDataMigration();
    console.log('Data migration result:', migrationResult);
    
    // Record successful initialization
    localStorage.setItem(INITIALIZED_KEY, 'true');
    localStorage.setItem(LAST_VERSION_KEY, CURRENT_VERSION);
    
    // Emit initialization event
    eventManager.emit('app:initialized', { version: CURRENT_VERSION });
    
    return true;
  } catch (error) {
    console.error('Error during application initialization:', error);
    return false;
  }
}

/**
 * Force refresh all data in the application
 */
export function forceRefreshAllData() {
  console.log('Forcing refresh of all application data...');
  
  try {
    // Emit events to force data refresh
    eventManager.emit('task:reload', undefined);
    eventManager.emit('habits:reload', undefined);
    eventManager.emit('notes:reload', undefined);
    
    // Also use legacy window events
    window.dispatchEvent(new Event('force-task-update'));
    window.dispatchEvent(new Event('force-habit-update'));
    window.dispatchEvent(new Event('force-note-update'));
    
    return true;
  } catch (error) {
    console.error('Error refreshing application data:', error);
    return false;
  }
}

/**
 * Reset application to initial state (dangerous!)
 */
export function resetApplication() {
  console.log('WARNING: Resetting application to initial state...');
  
  try {
    // Clear initialization flags
    localStorage.removeItem(INITIALIZED_KEY);
    localStorage.removeItem(LAST_VERSION_KEY);
    
    // Emit reset event
    eventManager.emit('app:reset', { timestamp: new Date().toISOString() });
    
    return true;
  } catch (error) {
    console.error('Error resetting application:', error);
    return false;
  }
}

// Export initialization function as default for easy importing
export default initializeApplication;
