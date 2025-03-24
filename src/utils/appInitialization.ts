
import { eventManager } from '@/lib/events/EventManager';
import { EventType, EventPayload } from '@/types';
import { runDataMigration } from './migrations/typeMigration';

// Feature flags
const ENABLE_ANALYTICS = false;
const ENABLE_AUTO_DATA_MIGRATION = true;
const ENABLE_DEBUG_MODE = false;

/**
 * Initialize the application on startup
 * This runs once when the app starts
 */
export function initializeApplication() {
  console.log('Initializing application...');
  
  // Setup event system
  setupEventSystem();
  
  // Check and run data migrations if needed
  if (ENABLE_AUTO_DATA_MIGRATION) {
    runDataMigrations();
  }
  
  // Initialize other global services as needed
  if (ENABLE_ANALYTICS) {
    initializeAnalytics();
  }
  
  console.log('Application initialization complete');
}

/**
 * Configure the event system
 */
function setupEventSystem() {
  // Enable debug mode for events during development
  if (ENABLE_DEBUG_MODE) {
    eventManager.setDebug(true);
    
    // Log all events for debugging
    eventManager.on('*', (data: { eventType: EventType; payload: any }) => {
      console.debug(`[Event] ${data.eventType}`, data.payload);
    });
    
    console.log('Event debug mode enabled');
  }
}

/**
 * Initialize analytics
 */
function initializeAnalytics() {
  console.log('Analytics initialized');
}

/**
 * Run data migrations if needed
 */
function runDataMigrations() {
  console.log('Checking for data migrations...');
  
  // Check if we have already run migrations
  const migrationsRun = localStorage.getItem('data-migrations-run');
  
  if (migrationsRun !== 'true') {
    console.log('Running data migrations...');
    try {
      const result = runDataMigration();
      
      if (result) {
        localStorage.setItem('data-migrations-run', 'true');
        console.log('Data migrations completed successfully');
      } else {
        console.error('Data migrations failed');
      }
    } catch (error) {
      console.error('Error running data migrations:', error);
    }
  } else {
    console.log('Data migrations already run, skipping');
  }
}
