import { createFrontendClient } from './config';
import type { DailySummary } from '@/types/summary';

const supabase = createFrontendClient();

interface EdgeFunctionResponse {
  data?: { id: string };
  message?: string;
  error?: string;
}

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

    const response = await supabase.functions.invoke<EdgeFunctionResponse>("send-task-summary", {
      body: { 
        email, 
        summaryData: {
          ...summaryData,
          // Ensure all numeric values are validated
          averageEfficiency: !isNaN(summaryData.averageEfficiency) ? summaryData.averageEfficiency : 0,
          totalTimeSpent: !isNaN(summaryData.totalTimeSpent) ? summaryData.totalTimeSpent : 0,
          totalPlannedTime: !isNaN(summaryData.totalPlannedTime) ? summaryData.totalPlannedTime : 0,
          totalPauses: !isNaN(summaryData.totalPauses) ? summaryData.totalPauses : 0,
        }
      },
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

// Export the client for direct database operations
export { supabase };