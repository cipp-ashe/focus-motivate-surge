
import { eventManager } from '@/lib/events/EventManager';
import { EventType } from '@/types/events';
import { runDataMigration } from './migrations/typeMigration';
import { logger } from '@/utils/logManager';
import { enableRealtimeForTables, disableRealtime } from '@/lib/supabase/client';

// Feature flags
const ENABLE_ANALYTICS = false;
const ENABLE_AUTO_DATA_MIGRATION = true;
const ENABLE_DEBUG_MODE = import.meta.env.DEV;
const ENABLE_REALTIME = true;

/**
 * Initialize the application on startup
 * This runs once when the app starts
 */
export function initializeApplication() {
  logger.info('App', 'Initializing application...');
  
  // Setup event system
  setupEventSystem();
  
  // Set up route change listener to manage realtime
  setupRouteChangeListener();
  
  // Check and run data migrations if needed
  if (ENABLE_AUTO_DATA_MIGRATION) {
    runDataMigrations();
  }
  
  // Initialize other global services as needed
  if (ENABLE_ANALYTICS) {
    initializeAnalytics();
  }
  
  // Enable realtime connection for database tables
  // Skip on homepage as we don't need live updates there
  if (ENABLE_REALTIME && window.location.pathname !== '/') {
    enableRealtimeForTables();
  }
  
  logger.info('App', 'Application initialization complete');
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
      logger.debug('Event', `${data.eventType}`, data.payload);
    });
    
    logger.debug('App', 'Event debug mode enabled');
  }
}

/**
 * Initialize analytics
 */
function initializeAnalytics() {
  logger.info('App', 'Analytics initialized');
}

/**
 * Run data migrations if needed
 */
function runDataMigrations() {
  logger.info('App', 'Checking for data migrations...');
  
  // Check if we have already run migrations
  const migrationsRun = localStorage.getItem('data-migrations-run');
  
  if (migrationsRun !== 'true') {
    logger.info('App', 'Running data migrations...');
    try {
      const result = runDataMigration();
      
      if (result) {
        localStorage.setItem('data-migrations-run', 'true');
        logger.info('App', 'Data migrations completed successfully');
      } else {
        logger.error('App', 'Data migrations failed');
      }
    } catch (error) {
      logger.error('App', 'Error running data migrations:', error);
    }
  } else {
    logger.debug('App', 'Data migrations already run, skipping');
  }
}

/**
 * Set up route change listener to manage realtime connections
 */
function setupRouteChangeListener() {
  // Monitor for route changes to conditionally enable/disable realtime
  window.addEventListener('popstate', handleRouteChange);
  
  logger.debug('App', 'Route change listener set up');
}

/**
 * Handle route changes to enable/disable realtime as needed
 */
function handleRouteChange() {
  const pathname = window.location.pathname;
  
  // Disable realtime on homepage, enable elsewhere
  if (pathname === '/') {
    logger.debug('Router', 'Navigated to homepage, disabling realtime');
    disableRealtime();
  } else if (ENABLE_REALTIME) {
    logger.debug('Router', `Navigated to ${pathname}, enabling realtime`);
    enableRealtimeForTables();
  }
}
