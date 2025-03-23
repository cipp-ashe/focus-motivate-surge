
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
