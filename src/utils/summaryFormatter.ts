
import { Task } from '@/types/tasks';
import { TaskMetrics } from '@/types/metrics';
import { formatDate, formatDuration } from '@/lib/utils/formatters';

/**
 * Utility functions for formatting task summaries
 */

export function formatChecklistItems(checklistItems: any[]): string {
  if (!checklistItems || checklistItems.length === 0) return 'No checklist items';
  
  return checklistItems.map(item => {
    return `- ${item.text} (${item.completed ? 'Completed' : 'Pending'})`;
  }).join('\n');
}

export function formatTaskMetrics(metrics: TaskMetrics): string {
  let summary = '';
  
  if (metrics.startTime) summary += `Start Time: ${formatDate(metrics.startTime)}\n`;
  if (metrics.endTime) summary += `End Time: ${formatDate(metrics.endTime)}\n`;
  if (metrics.actualDuration) summary += `Actual Duration: ${formatDuration(metrics.actualDuration)}\n`;
  if (metrics.expectedTime) summary += `Estimated Duration: ${formatDuration(metrics.expectedTime)}\n`;
  if (metrics.pausedTime) summary += `Paused Time: ${formatDuration(metrics.pausedTime)}\n`;
  if (metrics.extensionTime) summary += `Extension Time: ${formatDuration(metrics.extensionTime)}\n`;
  if (metrics.netEffectiveTime) summary += `Net Effective Time: ${formatDuration(metrics.netEffectiveTime)}\n`;
  
  return summary;
}

export function formatTaskWithMetrics(task: Task, metrics?: TaskMetrics): string {
  let summary = `Task: ${task.name}\n`;
  
  // Add basic task data
  if (task.description) summary += `Description: ${task.description}\n`;
  if (task.status) summary += `Status: ${task.status}\n`;
  
  // Add dates
  if (task.createdAt) summary += `Created: ${formatDate(task.createdAt)}\n`;
  if (task.relationships?.date) summary += `Scheduled: ${formatDate(task.relationships.date)}\n`;
  if (task.completedAt) summary += `Completed: ${formatDate(task.completedAt)}\n`;
  
  // Add metrics if available
  if (metrics) {
    summary += `\n--- Metrics ---\n${formatTaskMetrics(metrics)}`;
  }
  
  // Add checklist items
  if (task.checklistItems && task.checklistItems.length > 0) {
    summary += `\n--- Checklist Items ---\n${formatChecklistItems(task.checklistItems)}`;
  }
  
  return summary;
}

export function formatTasksAsText(tasks: Task[]): string {
  if (!tasks || tasks.length === 0) return 'No tasks available.';
  
  return tasks.map(task => formatTaskWithMetrics(task)).join('\n\n---\n\n');
}
