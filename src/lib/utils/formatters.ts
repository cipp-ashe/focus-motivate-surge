
/**
 * Format a duration in seconds to a human-readable string
 * @param seconds Duration in seconds
 * @returns Formatted string in format "1h 30m" or "45s"
 */
export function formatDuration(seconds: number): string {
  if (!seconds && seconds !== 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  let result = '';
  
  if (hours > 0) {
    result += `${hours}h `;
  }
  
  if (minutes > 0 || hours > 0) {
    result += `${minutes}m `;
  }
  
  if (remainingSeconds > 0 && hours === 0) {
    result += `${remainingSeconds}s`;
  }
  
  return result.trim();
}

/**
 * Format a datetime string to a human-readable format
 * @param dateString ISO date string
 * @returns Formatted string like "Mar 15, 2025 at 3:45 PM"
 */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

/**
 * Format a date string to a human-readable format without time
 * @param dateString ISO date string
 * @returns Formatted string like "Mar 15, 2025"
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

/**
 * Format a time string to a human-readable format
 * @param dateString ISO date string
 * @returns Formatted string like "3:45 PM"
 */
export function formatTime(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid Time';
  }
}

/**
 * Format a timestamp to a human-readable format
 * This is an alias for formatDateTime for backward compatibility
 * @param dateString ISO date string
 * @returns Formatted string like "Mar 15, 2025 at 3:45 PM"
 */
export function formatTimestamp(dateString: string | null | undefined): string {
  return formatDateTime(dateString);
}

/**
 * Format a number as a percentage
 * @param value Number value (0-1)
 * @returns Formatted percentage string like "75%"
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

/**
 * Convert minutes to a readable time format
 * @param minutes Number of minutes
 * @returns Formatted string
 */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}
