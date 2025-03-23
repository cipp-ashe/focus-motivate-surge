
/**
 * Convert a Date object to ISO string
 */
export const toISOString = (date: Date): string => {
  return date.toISOString();
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
