
import { calculateEfficiencyRatio, determineCompletionStatus } from '@/utils/timeUtils';

/**
 * Format seconds into a human-readable time string
 * @param seconds Number of seconds to format
 * @returns Formatted time string (HH:MM:SS or MM:SS)
 */
export const formatTimeDisplay = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  // Format with or without hours
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format a date to a readable string
 * @param date Date string or Date object
 * @param showTime Whether to include time
 * @returns Formatted date string
 */
export const formatDateDisplay = (date: string | Date, showTime: boolean = true): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  
  if (showTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return dateObj.toLocaleDateString(undefined, options);
};

/**
 * Format time in seconds to a human-readable duration
 * @param seconds Number of seconds
 * @returns Formatted duration string
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds && seconds !== 0) return 'N/A';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds > 0 ? `${remainingSeconds}s` : ''}`;
  } else {
    return `${remainingSeconds}s`;
  }
};

/**
 * Format a percentage value
 * @param value Decimal value (0-1)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number): string => {
  return `${Math.round(value * 100)}%`;
};

/**
 * Format a timestamp to human-readable format
 * @param timestamp ISO date string or Date object
 * @returns Formatted timestamp string
 */
export const formatTimestamp = (timestamp: string | Date): string => {
  if (!timestamp) return 'N/A';
  
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get CSS class based on completion status
 */
export const getCompletionTimingClass = (status: string): string => {
  if (status.includes('Early')) return 'text-green-500 dark:text-green-400';
  if (status.includes('On Time')) return 'text-blue-500 dark:text-blue-400';
  if (status.includes('Late')) return 'text-orange-500 dark:text-orange-400';
  return 'text-muted-foreground';
};

/**
 * Alias for formatTimeDisplay for compatibility
 */
export const formatTime = formatTimeDisplay;

// Re-export these functions to avoid import duplication
export { calculateEfficiencyRatio, determineCompletionStatus };
