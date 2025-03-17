
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
