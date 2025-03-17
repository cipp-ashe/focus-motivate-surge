
import { createClient } from '@supabase/supabase-js';

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
      // Log network activity in development mode only
      if (import.meta.env.DEV) {
        console.debug('Supabase fetch:', url);
      }
      return fetch(url, options);
    }
  }
});

// Create a hook for listening to auth changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};

// Single Realtime channel instance to prevent duplicate subscriptions
let realtimeChannel: any = null;

// Enable realtime for specific tables only when explicitly called
export const enableRealtimeForTables = async () => {
  // Only set up the channel if it doesn't already exist
  if (realtimeChannel) {
    console.log('Realtime already enabled for tables');
    return;
  }
  
  try {
    console.log('Enabling realtime for tables...');
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
      .subscribe();
    
    console.log('Realtime enabled for tables');
  } catch (error) {
    console.error('Error enabling realtime:', error);
  }
};
