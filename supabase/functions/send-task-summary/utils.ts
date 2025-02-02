import { TaskSummary } from "./types.ts";

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${remainingMinutes}m`;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Completed Early':
      return '#22c55e';
    case 'Completed On Time':
      return '#3b82f6';
    case 'Completed Late':
      return '#eab308';
    default:
      return '#6b7280';
  }
};

export const generateTaskRow = (task: TaskSummary): string => {
  const metrics = task.metrics;
  if (!metrics) return '';

  const statusColor = getStatusColor(metrics.completionStatus);
  const efficiency = metrics.efficiencyRatio.toFixed(1);
  const efficiencyColor = Number(efficiency) >= 90 ? '#22c55e' : 
                         Number(efficiency) >= 75 ? '#3b82f6' : '#eab308';

  return `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 16px; text-align: left;">
        <div style="font-weight: 500; color: #1a1a1a;">${task.taskName}</div>
        <span style="display: inline-block; margin-top: 4px; font-size: 12px; padding: 2px 8px; background: ${statusColor}20; color: ${statusColor}; border-radius: 9999px;">
          ${metrics.completionStatus}
        </span>
      </td>
      <td style="padding: 16px; text-align: left;">
        <div style="color: #4b5563; font-size: 14px;">
          Expected: ${formatDuration(metrics.originalDuration)}<br>
          Actual: ${formatDuration(metrics.actualDuration)}<br>
          Net: ${formatDuration(metrics.netEffectiveTime)}
        </div>
      </td>
      <td style="padding: 16px; text-align: left;">
        <div style="color: #4b5563; font-size: 14px;">
          Pauses: ${metrics.pauseCount} (${formatDuration(metrics.pausedTime)})<br>
          Added: ${formatDuration(metrics.extensionTime)}<br>
          <span style="color: ${efficiencyColor};">Efficiency: ${efficiency}%</span>
        </div>
      </td>
      <td style="padding: 16px; text-align: left;">
        ${task.relatedQuotes.map(quote => `
          <div style="margin: 8px 0; padding: 12px; background: #f8fafc; border-left: 3px solid #7c3aed; border-radius: 0 6px 6px 0;">
            <p style="margin: 0 0 4px 0; color: #1a1a1a; font-style: italic; font-size: 14px;">"${quote.text}"</p>
            <p style="margin: 0; color: #6b7280; font-size: 12px;">— ${quote.author}</p>
          </div>
        `).join('')}
      </td>
    </tr>
  `;
};

export const generateEmailContent = (
  totalTasks: number,
  totalTimeSpentFormatted: string,
  averageEfficiency: number,
  completedTasks: TaskSummary[],
  favoriteQuotes: Array<{ text: string; author: string }>
): string => {
  return `
    <div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">Focus Timer Summary</h1>
        <p style="color: white; opacity: 0.9; margin: 12px 0 0 0;">Here's your detailed productivity report</p>
      </div>

      <div style="padding: 32px;">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px;">
          <div style="background: #f8fafc; padding: 24px; border-radius: 12px; text-align: center;">
            <div style="color: #7c3aed; font-size: 24px; margin-bottom: 8px;">⏱️</div>
            <div style="color: #6b7280; font-size: 14px;">Time Focused</div>
            <div style="color: #1a1a1a; font-size: 24px; font-weight: 600;">${totalTimeSpentFormatted}</div>
          </div>
          <div style="background: #f8fafc; padding: 24px; border-radius: 12px; text-align: center;">
            <div style="color: #7c3aed; font-size: 24px; margin-bottom: 8px;">✅</div>
            <div style="color: #6b7280; font-size: 14px;">Tasks Completed</div>
            <div style="color: #1a1a1a; font-size: 24px; font-weight: 600;">${totalTasks}</div>
          </div>
          <div style="background: #f8fafc; padding: 24px; border-radius: 12px; text-align: center;">
            <div style="color: #7c3aed; font-size: 24px; margin-bottom: 8px;">📈</div>
            <div style="color: #6b7280; font-size: 14px;">Avg. Efficiency</div>
            <div style="color: #1a1a1a; font-size: 24px; font-weight: 600;">${averageEfficiency.toFixed(1)}%</div>
          </div>
        </div>

        <div style="background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                <th style="padding: 16px; text-align: left; color: #7c3aed; font-weight: 600;">Task</th>
                <th style="padding: 16px; text-align: left; color: #7c3aed; font-weight: 600;">Time</th>
                <th style="padding: 16px; text-align: left; color: #7c3aed; font-weight: 600;">Metrics</th>
                <th style="padding: 16px; text-align: left; color: #7c3aed; font-weight: 600;">Quotes</th>
              </tr>
            </thead>
            <tbody>
              ${completedTasks.map(task => generateTaskRow(task)).join('')}
            </tbody>
          </table>
        </div>

        ${favoriteQuotes.length > 0 ? `
          <div style="margin-top: 32px; background: #f8fafc; padding: 24px; border-radius: 12px;">
            <h2 style="color: #7c3aed; margin: 0 0 20px 0; font-size: 24px;">✨ Today's Favorite Quotes</h2>
            <div style="display: grid; gap: 16px;">
              ${favoriteQuotes.map(quote => `
                <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #7c3aed;">
                  <p style="margin: 0 0 8px 0; color: #1a1a1a; font-style: italic; font-size: 16px;">"${quote.text}"</p>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">— ${quote.author}</p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div style="text-align: center; margin-top: 32px; padding-top: 32px; border-top: 1px solid #e2e8f0;">
          <p style="color: #6b7280; margin: 0;">Keep up the great work! 🌟</p>
        </div>
      </div>
    </div>
  `;
};