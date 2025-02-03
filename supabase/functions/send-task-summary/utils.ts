// CORS headers for edge function responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export interface DailySummary {
  averageEfficiency: number;
  totalTimeSpent: number;
  totalPlannedTime: number;
  totalPauses: number;
  completedTasks: { taskName: string }[];
  unfinishedTasks: { taskName: string }[];
}

// Helper function to format minutes into hours and minutes
const formatMinutes = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  
  if (hours === 0) {
    return `${minutes} minutes`;
  }
  if (minutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''}`;
};

// Helper function to format summary email
export const formatSummaryEmail = (data: DailySummary): string => {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          h1 { color: #2563eb; }
          ul { list-style-type: none; padding-left: 0; }
          li { margin: 10px 0; padding: 10px; background: #f3f4f6; border-radius: 4px; }
          .highlight { color: #2563eb; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Your Daily Focus Summary</h1>
        <p>Here's what you accomplished today:</p>
        <ul>
          <li>Completed Tasks: <span class="highlight">${data.completedTasks.length}</span></li>
          <li>Average Efficiency: <span class="highlight">${data.averageEfficiency.toFixed(1)}%</span></li>
          <li>Total Time Spent: <span class="highlight">${formatMinutes(data.totalTimeSpent / 60)}</span></li>
          <li>Unfinished Tasks: <span class="highlight">${data.unfinishedTasks.length}</span></li>
          <li>Total Pauses: <span class="highlight">${data.totalPauses}</span></li>
        </ul>
        <p>Keep up the great work! 💪</p>
      </body>
    </html>
  `;
};
