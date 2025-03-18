
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

// Re-export these functions to avoid import duplication
export { calculateEfficiencyRatio, determineCompletionStatus };
