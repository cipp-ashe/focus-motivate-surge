/**
 * Central utility for standardized date handling across the application
 */
import { format, formatDistanceToNow, isDate } from 'date-fns';

// CONSTANTS
export const ISO_DATE_FORMAT = 'yyyy-MM-dd';
export const ISO_DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
export const DATE_DISPLAY_FORMAT = 'MMM d, yyyy';
export const TIME_DISPLAY_FORMAT = 'HH:mm';
export const DATE_TIME_DISPLAY_FORMAT = 'MMM d, yyyy HH:mm';

/**
 * Safely converts any date-like value to an ISO string
 * Always returns a string, never a Date object
 */
export const toISOString = (date: Date | string | number | null | undefined): string => {
  if (!date) return new Date().toISOString();
  
  try {
    // If it's already a string that looks like an ISO string, return it
    if (typeof date === 'string' && date.includes('T') && date.includes('Z')) {
      return date;
    }
    
    // Otherwise convert to Date and then to ISO string
    const dateObj = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;
      
    return isDate(dateObj) ? dateObj.toISOString() : new Date().toISOString();
  } catch (error) {
    console.error('Error converting date to ISO string:', error);
    return new Date().toISOString();
  }
};

/**
 * Safely parses any date-like value to a Date object
 * Returns null if parsing fails
 */
export const toDateObject = (date: Date | string | number | null | undefined): Date | null => {
  if (!date) return null;
  
  try {
    if (isDate(date)) return date as Date;
    
    const dateObj = new Date(date);
    return isNaN(dateObj.getTime()) ? null : dateObj;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

/**
 * Formats a date for display
 */
export const formatDate = (
  date: Date | string | number | null | undefined, 
  formatStr: string = DATE_DISPLAY_FORMAT
): string => {
  const dateObj = toDateObject(date);
  if (!dateObj) return 'Invalid date';
  
  try {
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Formats a date as a relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: Date | string | number | null | undefined): string => {
  const dateObj = toDateObject(date);
  if (!dateObj) return 'Unknown time';
  
  try {
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Unknown time';
  }
};

/**
 * Returns the current date and time as ISO string
 */
export const getCurrentISOString = (): string => {
  return new Date().toISOString();
};

/**
 * Validates if a string is a valid ISO format date
 */
export const isValidISOString = (dateString: string): boolean => {
  if (typeof dateString !== 'string') return false;
  
  try {
    const d = new Date(dateString);
    return !isNaN(d.getTime()) && dateString.includes('T');
  } catch (error) {
    return false;
  }
};
