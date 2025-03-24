import { Task, TaskMetrics } from '@/types/tasks';
import { Subtask } from '@/types/subtasks';
import { formatDate, formatDuration } from '@/lib/utils/formatters';

/**
 * Utility functions for formatting task summaries
 */

export function formatSubtasks(subtasks: Subtask[]): string {
  if (!subtasks || subtasks.length === 0) return 'No subtasks';
  
  return subtasks.map(subtask => {
    return `- ${subtask.name} (${subtask.completed ? 'Completed' : 'Pending'})`;
  }).join('\n');
}

export function formatTaskMetrics(metrics: TaskMetrics): string {
  let summary = '';
  
  if (metrics.startTime) summary += `Start Time: ${formatDate(metrics.startTime)}\n`;
  if (metrics.endTime) summary += `End Time: ${formatDate(metrics.endTime)}\n`;
  if (metrics.actualDuration) summary += `Actual Duration: ${formatDuration(metrics.actualDuration)}\n`;
  if (metrics.estimatedDuration) summary += `Estimated Duration: ${formatDuration(metrics.estimatedDuration)}\n`;
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
  if (task.priority) summary += `Priority: ${task.priority}\n`;
  
  // Add dates
  if (task.createdAt) summary += `Created: ${formatDate(task.createdAt)}\n`;
  if (task.scheduledDate) summary += `Scheduled: ${formatDate(task.scheduledDate)}\n`;
  if (task.completedDate) summary += `Completed: ${formatDate(task.completedDate)}\n`;
  
  // Add metrics if available
  if (metrics) {
    summary += `\n--- Metrics ---\n${formatTaskMetrics(metrics)}`;
  }
  
  // Add subtasks
  if (task.subtasks && task.subtasks.length > 0) {
    summary += `\n--- Subtasks ---\n${formatSubtasks(task.subtasks)}`;
  }
  
  return summary;
}

export function formatTasksAsText(tasks: Task[]): string {
  if (!tasks || tasks.length === 0) return 'No tasks available.';
  
  return tasks.map(task => formatTaskWithMetrics(task)).join('\n\n---\n\n');
}
