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
export const formatTime = (date: Date | string | null, options: Intl.DateTimeFormatOptions = {}): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  
  return dateObj.toLocaleTimeString(undefined, defaultOptions);
};

/**
 * Convert an ISO string or Date to a formatted date and time string
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
