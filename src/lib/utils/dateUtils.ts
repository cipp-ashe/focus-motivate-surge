
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
