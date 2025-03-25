
/**
 * Date utility functions for the application
 */

export function toISOString(date: Date): string {
  return date.toISOString();
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function minutesToSeconds(minutes: number): number {
  return minutes * 60;
}

export function secondsToMinutes(seconds: number): number {
  return Math.floor(seconds / 60);
}

export function getCurrentDateTime(): string {
  return new Date().toISOString();
}

export function getFormattedDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString();
}

export function getFormattedTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString();
}

export function getTimeDifferenceInSeconds(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  return Math.floor((end.getTime() - start.getTime()) / 1000);
}

/**
 * Format a date to a human-readable string using the provided options
 * @param date The date to format
 * @param options Optional formatting options
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, options: Intl.DateTimeFormatOptions = {}): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return dateObj.toLocaleDateString(undefined, defaultOptions);
}

/**
 * Format a date with time to a human-readable string
 * @param date The date to format
 * @param options Optional formatting options
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | string, options: Intl.DateTimeFormatOptions = {}): string {
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
}

/**
 * Get a relative time string like "5 minutes ago"
 * @param date The date to format
 * @returns A human-readable relative time string
 */
export function getRelativeTimeString(date: Date | string): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) {
    return diffSec === 1 ? '1 second ago' : `${diffSec} seconds ago`;
  }
  
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
  }
  
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) {
    return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
  }
  
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) {
    return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
  }
  
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) {
    return diffMonth === 1 ? '1 month ago' : `${diffMonth} months ago`;
  }
  
  const diffYear = Math.floor(diffMonth / 12);
  return diffYear === 1 ? '1 year ago' : `${diffYear} years ago`;
}
