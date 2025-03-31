
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/utils/logManager';

// Get environment variables
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client with optimized settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 1 // Reduce event rate to minimize network traffic
    }
  },
  global: {
    fetch: (url, options) => {
      // Only log in development mode
      if (import.meta.env.DEV) {
        logger.debug('Supabase', 'Fetch:', url);
      }
      return fetch(url, options);
    }
  }
});

// Create a hook for listening to auth changes
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};

// Single Realtime channel instance to prevent duplicate subscriptions
let realtimeChannel = null;
let realtimeEnabled = false;

// Enable realtime for specific tables only when explicitly called
export const enableRealtimeForTables = async (forceEnable = false) => {
  // Check if we're on the homepage, we can disable realtime there if not forced
  const isHomePage = window.location.pathname === '/' && !forceEnable;
  
  if (isHomePage && !forceEnable) {
    logger.debug('Supabase', 'Skipping realtime on homepage');
    return;
  }
  
  // Only set up the channel if it doesn't already exist
  if (realtimeChannel || realtimeEnabled) {
    logger.debug('Supabase', 'Realtime already enabled for tables');
    return;
  }
  
  realtimeEnabled = true;
  
  try {
    logger.debug('Supabase', 'Enabling realtime for tables...');
    // Create a single channel for all tables to minimize connections
    realtimeChannel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { 
        event: '*',
        schema: 'public',
        table: 'tasks'
      }, () => {})
      .on('postgres_changes', { 
        event: '*',
        schema: 'public',
        table: 'habit_templates'
      }, () => {})
      .on('postgres_changes', { 
        event: '*',
        schema: 'public',
        table: 'notes'
      }, () => {})
      .on('postgres_changes', { 
        event: '*',
        schema: 'public',
        table: 'events'
      }, () => {})
      .subscribe((status) => {
        logger.debug('Supabase', 'Realtime subscription status:', status);
      });
    
    logger.debug('Supabase', 'Realtime enabled for tables');
  } catch (error) {
    logger.error('Supabase', 'Error enabling realtime:', error);
    realtimeEnabled = false;
  }
};

// Helper to clean up realtime connection when not needed
export const disableRealtime = () => {
  if (realtimeChannel) {
    realtimeChannel.unsubscribe();
    realtimeChannel = null;
    realtimeEnabled = false;
    logger.debug('Supabase', 'Realtime disabled for tables');
  }
};
