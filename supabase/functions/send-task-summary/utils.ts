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

  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #7C3AED; color: white; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 32px;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Your Focus Timer Summary</h1>
        <p style="margin: 8px 0 0; opacity: 0.9;">Here's what you accomplished today!</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px;">
        <div style="background-color: #F5F3FF; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="color: #7C3AED; font-size: 24px; font-weight: 600; margin-bottom: 8px;">
            ${completedTasks.length}
          </div>
          <div style="color: #6B7280; font-size: 14px;">Tasks Completed</div>
        </div>
        <div style="background-color: #F5F3FF; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="color: #7C3AED; font-size: 24px; font-weight: 600; margin-bottom: 8px;">
            ${formatDuration(totalTimeSpent)}
          </div>
          <div style="color: #6B7280; font-size: 14px;">Total Time</div>
        </div>
        <div style="background-color: #F5F3FF; padding: 20px; border-radius: 8px; text-align: center;">
          <div style="color: #7C3AED; font-size: 24px; font-weight: 600; margin-bottom: 8px;">
            ${averageEfficiency !== null && !isNaN(Number(averageEfficiency)) ? Math.min(Number(averageEfficiency), 100).toFixed(1) : "N/A"}%
          </div>
          <div style="color: #6B7280; font-size: 14px;">Avg. Efficiency</div>
        </div>
      </div>

      <div style="background-color: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; margin-bottom: 32px;">
        <div style="background-color: #7C3AED; padding: 16px 24px;">
          <h2 style="color: white; margin: 0; font-size: 18px;">Completed Tasks</h2>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #F5F3FF;">
              <th style="padding: 12px 24px; text-align: left; color: #6B7280; font-weight: 500; border-bottom: 1px solid #E5E7EB;">Task</th>
              <th style="padding: 12px 24px; text-align: left; color: #6B7280; font-weight: 500; border-bottom: 1px solid #E5E7EB;">Duration</th>
              <th style="padding: 12px 24px; text-align: left; color: #6B7280; font-weight: 500; border-bottom: 1px solid #E5E7EB;">Status</th>
              <th style="padding: 12px 24px; text-align: left; color: #6B7280; font-weight: 500; border-bottom: 1px solid #E5E7EB;">Metrics</th>
            </tr>
          </thead>
          <tbody>
            ${completedTasks.map(task => `
              <tr style="border-bottom: 1px solid #E5E7EB;">
                <td style="padding: 16px 24px; color: #1F2937;">
                  ${task.taskName}
                </td>
                <td style="padding: 16px 24px;">
                  <div style="color: #6B7280;">
                    <div>Planned: ${formatDuration(task.metrics?.expectedTime || 0)}</div>
                    <div>Actual: ${formatDuration(task.metrics?.actualDuration || 0)}</div>
                  </div>
                </td>
                <td style="padding: 16px 24px;">
                  <span style="
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 9999px;
                    font-size: 12px;
                    font-weight: 500;
                    ${task.metrics?.completionStatus === 'Completed Early' ? 'background-color: #D1FAE5; color: #065F46;' :
                      task.metrics?.completionStatus === 'Completed On Time' ? 'background-color: #DBEAFE; color: #1E40AF;' :
                      'background-color: #FEE2E2; color: #991B1B;'
                    }
                  ">
        
            ${task.metrics?.completionStatus}
                  </span>
                  <div style="color: #6B7280; margin-top: 4px;">
                    ${Math.min((task.metrics?.efficiencyRatio ?? 0), 100).toFixed(1)}% efficiency
                  </div>
                </td>
                <td style="padding: 16px 24px;">
                  <div style="color: #6B7280;">
                    <div>⏸️ ${task.metrics?.pauseCount || 0} pauses (${formatDuration(task.metrics?.pausedTime || 0)})</div>
                    <div>⏱️ ${formatDuration(task.metrics?.extensionTime || 0)} extended</div>
                    <div>⭐ ${task.metrics?.favoriteQuotes || 0} quotes saved</div>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      ${unfinishedTasks.length > 0 ? `
  
      <div style="background-color: #F5F3FF; padding: 20px; border-radius: 12px; margin-top: 32px;">
  
        <h2 style="color: #7C3AED; margin: 0 0 8px;">Pending Tasks</h2>
          <p style="color: #6B7280; margin: 0;">You have ${unfinishedTasks.length} task${unfinishedTasks.length !== 1 ? 's' : ''} remaining.</p>
        </div>
      ` : ''}

      <div style="text-align: center; margin-top: 32px; color: #7C3AED;">
        <p style="font-size: 16px;">
Keep up the great work! 🎉</p>
      </div>
    </div>
  `;
};
