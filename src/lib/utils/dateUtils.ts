
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
 * Formats a date to local date string (e.g., "Jan 1, 2023")
 */
export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
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
