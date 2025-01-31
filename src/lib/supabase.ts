import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const sendTaskSummaryEmail = async (email: string, summaryData: any) => {
  const { error } = await supabase.functions.invoke('send-task-summary', {
    body: { email, summaryData },
  });

  if (error) throw error;
};