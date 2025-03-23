
/**
 * Convert a Date object to ISO string
 */
export const toISOString = (date: Date): string => {
  return date.toISOString();
};

/**
 * Format a date with the specified format string
 * Basic implementation that supports common format patterns
 */
export const formatDate = (date: string | Date, format: string = 'yyyy-MM-dd'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date provided to formatDate:', date);
    return 'Invalid date';
  }
  
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();
  
  // Replace format tokens with actual values
  return format
    .replace('yyyy', year.toString())
    .replace('MM', month.toString().padStart(2, '0'))
    .replace('M', month.toString())
    .replace('dd', day.toString().padStart(2, '0'))
    .replace('d', day.toString())
    .replace('HH', hours.toString().padStart(2, '0'))
    .replace('H', hours.toString())
    .replace('mm', minutes.toString().padStart(2, '0'))
    .replace('m', minutes.toString())
    .replace('ss', seconds.toString().padStart(2, '0'))
    .replace('s', seconds.toString());
};

/**
 * Format a time duration in seconds
 */
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

/**
 * Format a date relative to the current time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const inputDate = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(inputDate.getTime())) {
    console.error('Invalid date provided to formatRelativeTime:', date);
    return 'Invalid date';
  }
  
  const diffMs = now.getTime() - inputDate.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  } else {
    return formatDate(inputDate, 'MM/dd/yyyy');
  }
};

/**
 * Get today's date as YYYY-MM-DD format
 */
export const formatToday = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
};

/**
 * Format a date string to a human-readable format
 */
export const formatDateHuman = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Get the day of week (0-6) for a date string
 */
export const getDayOfWeek = (dateString: string): number => {
  const date = new Date(dateString);
  return date.getDay();
};

/**
 * Get the name of the day for a date string
 */
export const getDayName = (dateString: string, short = false): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { 
    weekday: short ? 'short' : 'long' 
  });
};

/**
 * Check if a date is today
 */
export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

/**
 * Convert date to a specific timezone
 */
export const toZonedTime = (date: Date, timeZone: string): Date => {
  // Simple implementation that doesn't actually convert timezone
  // For proper timezone support, use date-fns-tz or similar library
  return new Date(date);
};

/**
 * Convert date from a specific timezone to UTC
 */
export const fromZonedTime = (zonedDate: Date, timeZone: string): Date => {
  // Simple implementation that doesn't actually convert timezone
  // For proper timezone support, use date-fns-tz or similar library
  return new Date(zonedDate);
};

/**
 * Format a date with a timezone
 */
export const formatInTimeZone = (date: Date, timeZone: string, formatStr: string): string => {
  // Simple implementation that doesn't actually use timezone
  // For proper timezone support, use date-fns-tz or similar library
  const localDate = new Date(date);
  return localDate.toLocaleDateString();
};

/**
 * Convert ISO string to Date object
 */
export const parseISO = (dateString: string): Date => {
  return new Date(dateString);
};

/**
 * Add days to a date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Get start of day (midnight)
 */
export const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Get end of day (23:59:59.999)
 */
export const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};
