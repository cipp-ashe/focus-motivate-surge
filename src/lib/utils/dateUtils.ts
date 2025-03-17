
/**
 * Converts a Date object to a properly formatted ISO string
 * This ensures that we always have consistent date formatting
 */
export const toISOString = (date: Date | string | undefined): string => {
  if (!date) {
    return new Date().toISOString();
  }
  
  if (typeof date === 'string') {
    // Check if already in ISO format
    if (date.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)) {
      return date;
    }
    
    try {
      return new Date(date).toISOString();
    } catch (e) {
      console.error("Invalid date string:", date);
      return new Date().toISOString();
    }
  }
  
  return date.toISOString();
};

/**
 * Formats a date to local date string with optional format pattern
 * @param date The date to format
 * @param format Optional format string (defaults to 'MMM d, yyyy')
 */
export const formatDate = (date: Date | string | undefined, format?: string): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Default format if none provided
  const formatStr = format || 'MMM d, yyyy';
  
  // Very simple formatting implementation
  // In a real app, we'd use date-fns or similar
  let result = formatStr;
  
  // Year formatting
  result = result.replace('yyyy', dateObj.getFullYear().toString());
  result = result.replace('yy', dateObj.getFullYear().toString().slice(2));
  
  // Month formatting
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  result = result.replace('MMM', months[dateObj.getMonth()]);
  result = result.replace('MM', (dateObj.getMonth() + 1).toString().padStart(2, '0'));
  result = result.replace('M', (dateObj.getMonth() + 1).toString());
  
  // Day formatting
  result = result.replace('dd', dateObj.getDate().toString().padStart(2, '0'));
  result = result.replace('d', dateObj.getDate().toString());
  
  // Hour formatting
  const hours24 = dateObj.getHours();
  const hours12 = hours24 % 12 || 12;
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  
  result = result.replace('HH', hours24.toString().padStart(2, '0'));
  result = result.replace('H', hours24.toString());
  result = result.replace('hh', hours12.toString().padStart(2, '0'));
  result = result.replace('h', hours12.toString());
  result = result.replace('a', ampm.toLowerCase());
  result = result.replace('A', ampm);
  
  // Minute formatting
  result = result.replace('mm', dateObj.getMinutes().toString().padStart(2, '0'));
  result = result.replace('m', dateObj.getMinutes().toString());
  
  // Second formatting
  result = result.replace('ss', dateObj.getSeconds().toString().padStart(2, '0'));
  result = result.replace('s', dateObj.getSeconds().toString());
  
  return result;
};

/**
 * Formats a date to local time string (e.g., "2:30 PM")
 */
export const formatTime = (date: Date | string | undefined): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Get the start of the current day
 */
export const getStartOfDay = (date: Date = new Date()): Date => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
};

/**
 * Get the end of the current day
 */
export const getEndOfDay = (date: Date = new Date()): Date => {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Get a formatted date string for use in task relationships
 */
export const getDateString = (date: Date = new Date()): string => {
  return date.toDateString();
};

/**
 * Format a date relative to now (e.g., "2 days ago")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInMilliseconds = now.getTime() - targetDate.getTime();
  
  // Convert to seconds
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  // Convert to minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  // Convert to hours
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Convert to days
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  // Convert to months
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }
  
  // Convert to years
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
};

/**
 * Returns the current date as an ISO string
 */
export const getCurrentISOString = (): string => {
  return new Date().toISOString();
};
