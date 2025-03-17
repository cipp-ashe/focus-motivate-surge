
import { Task } from "@/types/tasks";
import { formatDate } from "@/lib/utils/dateUtils";
import { formatDuration, calculateEfficiencyRatio } from "@/lib/utils/formatters";

export const formatTaskSummary = (task: Task): string => {
  const lines: string[] = [];
  
  // Task name and completion status
  lines.push(`# ${task.name}`);
  lines.push(`**Status**: ${task.completed ? "Completed" : task.dismissedAt ? "Dismissed" : "Pending"}`);
  
  // Date information
  if (task.completedAt) {
    lines.push(`**Completed**: ${formatDate(task.completedAt, "MMM d, yyyy 'at' HH:mm")}`);
  }
  if (task.dismissedAt) {
    lines.push(`**Dismissed**: ${formatDate(task.dismissedAt, "MMM d, yyyy 'at' HH:mm")}`);
  }
  lines.push(`**Created**: ${formatDate(task.createdAt, "MMM d, yyyy 'at' HH:mm")}`);
  
  // Task metrics if available
  if (task.metrics) {
    lines.push("\n## Metrics");
    
    if (task.metrics.expectedTime) {
      lines.push(`**Expected Time**: ${formatDuration(task.metrics.expectedTime)}`);
    }
    
    if (task.metrics.actualDuration) {
      lines.push(`**Actual Duration**: ${formatDuration(task.metrics.actualDuration)}`);
    } else if (task.metrics.timeSpent) {
      lines.push(`**Time Spent**: ${formatDuration(task.metrics.timeSpent)}`);
    }
    
    if (task.metrics.pauseCount) {
      lines.push(`**Breaks Taken**: ${task.metrics.pauseCount}`);
    }
    
    if (task.metrics.expectedTime && task.metrics.actualDuration) {
      const efficiencyPercentage = calculateEfficiencyRatio(task.metrics.expectedTime, task.metrics.actualDuration) * 100;
      lines.push(`**Efficiency**: ${Math.round(efficiencyPercentage)}%`);
    }
  }
  
  // Task description if available
  if (task.description) {
    lines.push("\n## Description");
    lines.push(task.description);
  }
  
  // Journal entry if available
  if (task.journalEntry) {
    lines.push("\n## Journal Entry");
    lines.push(task.journalEntry);
  }
  
  // Tags if available
  if (task.tags && task.tags.length > 0) {
    lines.push("\n## Tags");
    const tagNames = task.tags.map(tag => tag.name).join(", ");
    lines.push(tagNames);
  }
  
  return lines.join("\n");
};
