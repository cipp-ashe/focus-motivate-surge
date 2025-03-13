
/**
 * Formats a duration in seconds to a human-readable string
 * @param seconds - The duration in seconds
 * @returns A formatted string like "1h 30m" or "45m"
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return "0m";
  
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`;
  }
  return `${minutes}m`;
};

/**
 * Formats a percentage value
 * @param value - The percentage as a decimal (0-1)
 * @returns A formatted percentage string
 */
export const formatPercentage = (value: number): string => {
  if (isNaN(value)) return "0%";
  return `${Math.round(value * 100)}%`;
};

/**
 * Formats a timestamp to a readable date/time
 * @param timestamp - ISO timestamp or Date object
 * @returns Formatted date string
 */
export const formatTimestamp = (timestamp: string | Date | null): string => {
  if (!timestamp) return "N/A";
  
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
};
