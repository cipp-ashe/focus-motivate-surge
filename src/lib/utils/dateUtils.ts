
/**
 * Formats a time value in seconds to a display string
 * @param seconds Total seconds to format
 * @param showSeconds Whether to include seconds in the formatted string
 * @returns Formatted time string (e.g. "2h 30m" or "45m 20s")
 */
export const formatTime = (seconds: number, showSeconds: boolean = false): string => {
  if (isNaN(seconds) || seconds < 0) {
    return showSeconds ? '0m 0s' : '0m';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  let result = '';
  
  if (hours > 0) {
    result += `${hours}h `;
  }
  
  if (minutes > 0 || (hours > 0 && remainingSeconds > 0)) {
    result += `${minutes}m`;
  } else if (hours === 0 && minutes === 0 && !showSeconds) {
    result = '1m'; // Show at least 1m if very short and not showing seconds
  }
  
  if (showSeconds && (remainingSeconds > 0 || (hours === 0 && minutes === 0))) {
    if (result) result += ' ';
    result += `${remainingSeconds}s`;
  }
  
  return result.trim();
};

/**
 * Converts a Date object to an ISO string
 * Handles cases where the input could be a string or Date
 */
export const toISOString = (date: Date | string): string => {
  if (typeof date === 'string') {
    return new Date(date).toISOString();
  }
  return date.toISOString();
};

/**
 * Formats a date for display, with configurable format
 * @param date Date to format (can be Date object or ISO string)
 * @param format Optional format string (default is 'MMM d, yyyy')
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date, format: string = 'MMM d, yyyy'): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date provided to formatDate:', date);
    return 'Invalid date';
  }
  
  // Very basic formatter that handles common patterns
  const formats: Record<string, string> = {
    'yyyy': dateObj.getFullYear().toString(),
    'MM': (dateObj.getMonth() + 1).toString().padStart(2, '0'),
    'M': (dateObj.getMonth() + 1).toString(),
    'dd': dateObj.getDate().toString().padStart(2, '0'),
    'd': dateObj.getDate().toString(),
    'HH': dateObj.getHours().toString().padStart(2, '0'),
    'H': dateObj.getHours().toString(),
    'hh': (dateObj.getHours() > 12 ? dateObj.getHours() - 12 : dateObj.getHours() || 12).toString().padStart(2, '0'),
    'h': (dateObj.getHours() > 12 ? dateObj.getHours() - 12 : dateObj.getHours() || 12).toString(),
    'mm': dateObj.getMinutes().toString().padStart(2, '0'),
    'm': dateObj.getMinutes().toString(),
    'ss': dateObj.getSeconds().toString().padStart(2, '0'),
    's': dateObj.getSeconds().toString(),
    'MMM': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][dateObj.getMonth()],
    'MMMM': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][dateObj.getMonth()],
    'EEE': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()],
    'EEEE': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dateObj.getDay()]
  };
  
  // Replace format strings with actual values
  let result = format;
  for (const [key, value] of Object.entries(formats)) {
    result = result.replace(key, value);
  }
  
  return result;
};

/**
 * Formats a date relative to the current time (e.g., "2 hours ago")
 * @param date Date to format (can be Date object or ISO string)
 * @returns Relative time string
 */
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  } else {
    return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
  }
};
