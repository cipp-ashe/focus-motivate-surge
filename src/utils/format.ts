
/**
 * Format Utilities
 * Collection of formatting utility functions
 */

/**
 * Formats a duration in seconds to a human-readable format
 * @param seconds Total duration in seconds
 * @returns Formatted duration string (e.g., "25m", "1h 30m")
 */
export const getHumanReadableDuration = (seconds: number): string => {
  if (!seconds || seconds <= 0) return "0m";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
  }
  
  return `${minutes}m`;
};

/**
 * Converts minutes to seconds
 * @param minutes Number of minutes
 * @returns Number of seconds
 */
export const minutesToSeconds = (minutes: number): number => {
  return minutes * 60;
};

/**
 * Converts seconds to minutes
 * @param seconds Number of seconds
 * @returns Number of minutes
 */
export const secondsToMinutes = (seconds: number): number => {
  return Math.floor(seconds / 60);
};

/**
 * Formats seconds to MM:SS format
 * @param seconds Number of seconds
 * @returns Time in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

/**
 * Convert a Date object to an ISO string safely
 * If the input is already a string, return it unchanged
 */
export const toISOString = (date: Date | string | null): string => {
  if (date === null) {
    return new Date().toISOString();
  }
  if (typeof date === 'string') {
    return date;
  }
  return date.toISOString();
};

/**
 * Convert an ISO string or Date to a formatted date string
 */
export const formatDate = (date: Date | string | null, options: Intl.DateTimeFormatOptions = {}): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return dateObj.toLocaleDateString(undefined, defaultOptions);
};

/**
 * Convert an ISO string or Date to a formatted time string
 */
export const formatDateTime = (date: Date | string | null, options: Intl.DateTimeFormatOptions = {}): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  
  return dateObj.toLocaleString(undefined, defaultOptions);
};

/**
 * Format a date relative to the current time (e.g., "2 hours ago", "yesterday")
 */
export const formatRelativeTime = (date: Date | string | null): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return days === 1 ? 'yesterday' : `${days} days ago`;
  }
  
  // More than a week, format the date
  return formatDate(dateObj);
};
