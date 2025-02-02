import { DailySummary } from "./types.ts";

const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds} seconds`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} hour${hours !== 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}` : ''}`;
};

export const generateEmailContent = (summaryData: DailySummary): string => {
  const {
    completedTasks,
    unfinishedTasks,
    totalTimeSpent,
    averageEfficiency,
  } = summaryData;

  const taskList = completedTasks.map(task => `
    <li style="margin-bottom: 10px;">
      <strong>${task.name}</strong><br>
      Time spent: ${formatDuration(task.metrics?.actualDuration || 0)}<br>
      Efficiency: ${task.metrics?.efficiencyRatio.toFixed(1)}%
    </li>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #7C3AED; margin-bottom: 20px;">Your Daily Task Summary</h1>
      
      <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1F2937; margin-top: 0;">Overview</h2>
        <p>Total tasks completed: ${completedTasks.length}</p>
        <p>Total time spent: ${formatDuration(totalTimeSpent)}</p>
        <p>Average efficiency: ${averageEfficiency.toFixed(1)}%</p>
      </div>

      ${completedTasks.length > 0 ? `
        <div style="margin-top: 20px;">
          <h2 style="color: #1F2937;">Completed Tasks</h2>
          <ul style="list-style-type: none; padding: 0;">
            ${taskList}
          </ul>
        </div>
      ` : ''}

      ${unfinishedTasks.length > 0 ? `
        <div style="margin-top: 20px;">
          <h2 style="color: #1F2937;">Pending Tasks</h2>
          <p>You have ${unfinishedTasks.length} task${unfinishedTasks.length !== 1 ? 's' : ''} remaining.</p>
        </div>
      ` : ''}

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 14px;">
        <p>Keep up the great work! 🎉</p>
      </div>
    </div>
  `;
};