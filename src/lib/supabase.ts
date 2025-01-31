import { createClient } from '@supabase/supabase-js';
import { DailySummary } from '../types/summary';

interface EdgeFunctionResponse {
  data: { id: string } | null;
  error: Error | null;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const sendTaskSummaryEmail = async (email: string, summaryData: DailySummary) => {
  try {
    const response = await supabase.functions.invoke<EdgeFunctionResponse>('send-task-summary', {
      body: { email, summaryData },
    });

    if (response.error) {
      console.error('Edge function error:', {
        message: response.error.message,
        name: response.error.name,
        details: response.error,
      });
      throw new Error(`Failed to send email: ${response.error.message || 'Unknown error'}`);
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Send email error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    }
    throw error;
  }
};