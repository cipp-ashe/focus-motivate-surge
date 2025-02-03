import { createClient } from '@supabase/supabase-js';
import { DailySummary } from '../types/summary';

interface EdgeFunctionResponse {
  data?: { id: string };
  message?: string;
  error?: string;
}

// Supabase Edge Functions run on Deno, so we check for it
const isDeno = typeof Deno !== "undefined" && "env" in Deno;

const supabaseUrl = isDeno ? Deno.env.get("SUPABASE_URL") : import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = isDeno ? Deno.env.get("SUPABASE_ANON_KEY") : import.meta.env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase environment variables are missing! Some features may not work.");
}

// Use a function to initialize Supabase when needed
export const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("❌ Supabase environment variables are missing! Check Supabase settings.");
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const sendTaskSummaryEmail = async (email: string, summaryData: DailySummary) => {
  console.log("Attempting to send email summary:", {
    to: email,
    summaryData: {
      completedTasks: summaryData.completedTasks.length,
      unfinishedTasks: summaryData.unfinishedTasks.length,
      totalTimeSpent: summaryData.totalTimeSpent,
      averageEfficiency: summaryData.averageEfficiency ? summaryData.averageEfficiency.toFixed(1) : "N/A",
    },
  });

  try {
    console.log("Invoking Supabase Edge Function: send-task-summary");
    const supabase = getSupabaseClient();

    const response = await supabase.functions.invoke<EdgeFunctionResponse>("send-task-summary", {
      body: { email, summaryData },
    });

    console.log("Edge function response:", response);

    if (!response || !response.data || response.error) {
      console.error("Edge function error details:", {
        message: response?.error || "Unknown error",
        details: response,
      });
      throw new Error(`Failed to send email: ${response?.error || "Unknown error"}`);
    }

    console.log("Email sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Send email error details:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};
