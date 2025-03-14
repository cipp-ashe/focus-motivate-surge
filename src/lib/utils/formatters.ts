
// Consolidated time and formatting utilities
import { formatDate as formatDateHelper, formatRelativeTime } from './dateUtils';

// Duration formatting (seconds to human-readable)
export const formatDuration = (seconds: number): string => {
  if (!seconds || seconds === 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''} ${remainingSeconds > 0 ? `${remainingSeconds}s` : ''}`.trim();
  }
  if (minutes > 0) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  return `${remainingSeconds}s`;
};

// Convert seconds to MM:SS format
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Legacy formatDate that now uses our new utility (for backwards compatibility)
export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  return formatDateHelper(dateString, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Legacy formatTimestamp that now uses our new utility (for backwards compatibility)
export const formatTimestamp = (dateString: string): string => {
  try {
    return formatDateHelper(dateString, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return dateString;
  }
};

// Format a number as a percentage
export const formatPercentage = (value: number): string => {
  const percentage = value * 100;
  return `${Math.round(percentage)}%`;
};

// Timer efficiency calculations
export const calculateEfficiencyRatio = (expectedTime: number, netEffectiveTime: number): number => {
  if (netEffectiveTime === 0 || expectedTime === 0) return 0;
  return netEffectiveTime / expectedTime;
};

export const calculateEfficiencyPercentage = (expectedTime: number, netEffectiveTime: number): number => {
  if (netEffectiveTime === 0 || expectedTime === 0) return 0;
  const ratio = (netEffectiveTime / expectedTime) * 100;
  return Math.min(ratio, 100);
};

// Determine the completion status based on efficiency ratio
export const determineCompletionStatus = (
  expectedTime: number, 
  netEffectiveTime: number
): 'Completed Early' | 'Completed On Time' | 'Completed Late' => {
  const ratio = calculateEfficiencyRatio(expectedTime, netEffectiveTime);
  if (ratio < 0.8) return 'Completed Early';
  if (ratio > 1.2) return 'Completed Late';
  return 'Completed On Time';
};

// Visual styles for task completion status
export const getCompletionStatusColor = (status: string) => {
  switch (status) {
    case 'Completed Early':
      return 'text-green-500';
    case 'Completed On Time':
      return 'text-blue-500';
    case 'Completed Late':
      return 'text-yellow-500';
    default:
      return 'text-muted-foreground';
  }
};

export const getCompletionIcon = (status: string) => {
  switch (status) {
    case 'Completed Early':
      return 'CheckCircle2';
    case 'Completed On Time':
      return 'Timer';
    case 'Completed Late':
      return 'AlertTriangle';
    default:
      return 'Timer';
  }
};

export const getCompletionTimingClass = (status: 'Completed Early' | 'Completed On Time' | 'Completed Late' | string): string => {
  switch (status) {
    case 'Completed Early':
      return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200/30';
    case 'Completed On Time':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/30';
    case 'Completed Late':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/30';
    default:
      return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200/30';
  }
};
