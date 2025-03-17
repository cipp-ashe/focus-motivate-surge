
import { createClient } from '@supabase/supabase-js';

// Get environment variables
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client with realtime enabled
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Create a hook for listening to auth changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};

// Enable realtime for specific tables
export const enableRealtimeForTables = async () => {
  try {
    // Add all tables to the realtime subscription
    await supabase.channel('schema-db-changes')
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
