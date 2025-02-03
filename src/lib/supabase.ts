import { createClient } from '@supabase/supabase-js';
import { DailySummary } from '../types/summary';

interface EdgeFunctionResponse {
  data?: { id: string };
  message?: string;
  error?: string
}

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? import.meta.env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase environment variables are missing!");
}

export const getSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const sendTaskSummaryEmail = async (email: string, summaryData: DailySummary) => {
  console.log('Attempting to send email summary:', {
    to: email,
    summaryData: {
      completedTasks: summaryData.completedTasks.length,
      unfinishedTasks: summaryData.unfinishedTasks.length,
      totalTimeSpent: summaryData.totalTimeSpent,
      averageEfficiency: summaryData.averageEfficiency,
    }
  });

  try {
    console.log('Invoking Supabase Edge Function: send-task-summary');
    const supabase = getSupabaseClient();
const response = await supabase.functions.invoke<EdgeFunctionResponse>('send-task-summary', {
  body: { email, summaryData },
});

    console.log('Edge function response:', response);

    if (response.error || !response.data) {
      console.error('Edge function error details:', {
        message: response.error,
        details: response,
      });
      const errorMessage = response.error || 'Unknown error';
      throw new Error(`Failed to send email: ${errorMessage}`);
    }

    console.log('Email sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Send email error details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};
