import { TaskSummary } from "./types.ts";

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${remainingMinutes}m`;
};

const getStatusEmoji = (status: string): string => {
  switch (status) {
    case 'Completed Early':
      return '🌟';
    case 'Completed On Time':
      return '✨';
    case 'Completed Late':
      return '⏰';
    default:
      return '📝';
  }
};

const getEfficiencyMessage = (efficiency: number): string => {
  if (efficiency >= 95) return "Exceptional focus! You're in the zone! 🎯";
  if (efficiency >= 85) return "Great work! Keep it up! 🌟";
  if (efficiency >= 75) return "Solid performance! 💪";
  return "Keep pushing forward! 🚀";
};

const generateProgressBar = (percentage: number): string => {
  const filledChar = '█';
  const emptyChar = '░';
  const width = 20;
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return filledChar.repeat(filled) + emptyChar.repeat(empty);
};

const generateTaskRow = (task: TaskSummary): string => {
  const metrics = task.metrics;
  if (!metrics) return '';

  const efficiency = metrics.efficiencyRatio.toFixed(1);
  const progressBar = generateProgressBar(Number(efficiency));
  const statusEmoji = getStatusEmoji(metrics.completionStatus);

  return `
    <tr style="border-bottom: 1px solid rgba(124, 58, 237, 0.1);">
      <td style="padding: 24px; text-align: left;">
        <div style="font-weight: 500; color: #1a1a1a; font-size: 16px; margin-bottom: 8px;">
          ${statusEmoji} ${task.taskName}
        </div>
        <div style="display: inline-block; margin-top: 4px; font-size: 12px; padding: 4px 12px; background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: white; border-radius: 20px; font-weight: 500;">
          ${metrics.completionStatus}
        </div>
      </td>
      <td style="padding: 24px; text-align: left;">
        <div style="color: #4b5563; font-size: 14px; line-height: 1.6;">
          <div style="margin-bottom: 4px;">⏱️ Expected: ${formatDuration(metrics.originalDuration)}</div>
          <div style="margin-bottom: 4px;">⚡ Actual: ${formatDuration(metrics.actualDuration)}</div>
          <div>🎯 Net: ${formatDuration(metrics.netEffectiveTime)}</div>
        </div>
      </td>
      <td style="padding: 24px; text-align: left;">
        <div style="color: #4b5563; font-size: 14px; line-height: 1.6;">
          <div style="margin-bottom: 8px;">
            <span style="font-family: monospace; letter-spacing: -0.5px;">${progressBar}</span>
            <div style="font-size: 18px; font-weight: 600; background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              ${efficiency}% Efficiency
            </div>
          </div>
          <div style="margin-bottom: 4px;">⏸️ Pauses: ${metrics.pauseCount} (${formatDuration(metrics.pausedTime)})</div>
          <div>⏲️ Added: ${formatDuration(metrics.extensionTime)}</div>
        </div>
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
  const efficiencyMessage = getEfficiencyMessage(averageEfficiency);
  const timeOfDay = new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening";
  
  return `
    <div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
      <div style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding: 48px 32px; text-align: center; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url('data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E'); opacity: 0.5;"></div>
        <h1 style="color: white; margin: 0; font-size: 36px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">✨ Focus Timer Summary</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 18px;">Good ${timeOfDay}! Here's your productivity insights</p>
      </div>

      <div style="padding: 32px;">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px;">
          <div style="background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(109, 40, 217, 0.1) 100%); padding: 24px; border-radius: 16px; text-align: center; border: 1px solid rgba(124, 58, 237, 0.2);">
            <div style="color: #7c3aed; font-size: 32px; margin-bottom: 8px;">⏱️</div>
            <div style="color: #6b7280; font-size: 14px; margin-bottom: 4px;">Time Focused</div>
            <div style="color: #1a1a1a; font-size: 24px; font-weight: 600;">${totalTimeSpentFormatted}</div>
          </div>
          <div style="background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(109, 40, 217, 0.1) 100%); padding: 24px; border-radius: 16px; text-align: center; border: 1px solid rgba(124, 58, 237, 0.2);">
            <div style="color: #7c3aed; font-size: 32px; margin-bottom: 8px;">✅</div>
            <div style="color: #6b7280; font-size: 14px; margin-bottom: 4px;">Tasks Completed</div>
            <div style="color: #1a1a1a; font-size: 24px; font-weight: 600;">${totalTasks}</div>
          </div>
          <div style="background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(109, 40, 217, 0.1) 100%); padding: 24px; border-radius: 16px; text-align: center; border: 1px solid rgba(124, 58, 237, 0.2);">
            <div style="color: #7c3aed; font-size: 32px; margin-bottom: 8px;">📈</div>
            <div style="color: #6b7280; font-size: 14px; margin-bottom: 4px;">Avg. Efficiency</div>
            <div style="color: #1a1a1a; font-size: 24px; font-weight: 600;">${averageEfficiency.toFixed(1)}%</div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; overflow: hidden; border: 1px solid rgba(124, 58, 237, 0.2); margin-bottom: 32px;">
          <div style="background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(109, 40, 217, 0.1) 100%); padding: 24px; text-align: center;">
            <h2 style="margin: 0; color: #7c3aed; font-size: 24px; font-weight: 600;">${efficiencyMessage}</h2>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: rgba(124, 58, 237, 0.05);">
                <th style="padding: 16px; text-align: left; color: #7c3aed; font-weight: 600;">Task</th>
                <th style="padding: 16px; text-align: left; color: #7c3aed; font-weight: 600;">Time</th>
                <th style="padding: 16px; text-align: left; color: #7c3aed; font-weight: 600;">Performance</th>
              </tr>
            </thead>
            <tbody>
              ${completedTasks.map(task => generateTaskRow(task)).join('')}
            </tbody>
          </table>
        </div>

        ${favoriteQuotes.length > 0 ? `
          <div style="margin-top: 32px; background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(109, 40, 217, 0.1) 100%); padding: 32px; border-radius: 16px; border: 1px solid rgba(124, 58, 237, 0.2);">
            <h2 style="color: #7c3aed; margin: 0 0 24px 0; font-size: 24px; text-align: center;">✨ Today's Inspiring Quotes</h2>
            <div style="display: grid; gap: 16px;">
              ${favoriteQuotes.map(quote => `
                <div style="background: white; padding: 24px; border-radius: 12px; border: 1px solid rgba(124, 58, 237, 0.2); position: relative;">
                  <div style="position: absolute; top: -12px; left: 24px; background: #7c3aed; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500;">Quote of the Day</div>
                  <p style="margin: 0 0 12px 0; color: #1a1a1a; font-style: italic; font-size: 18px; line-height: 1.6;">"${quote.text}"</p>
                  <p style="margin: 0; color: #7c3aed; font-size: 14px; font-weight: 500;">— ${quote.author}</p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div style="text-align: center; margin-top: 32px; padding-top: 32px; border-top: 1px solid rgba(124, 58, 237, 0.2);">
          <p style="color: #6b7280; margin: 0; font-size: 14px;">
            Made with ❤️ by Focus Timer<br>
            <span style="color: #7c3aed;">Keep building great habits!</span>
          </p>
        </div>
      </div>
    </div>
  `;
};