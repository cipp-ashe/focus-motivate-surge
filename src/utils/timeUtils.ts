
/**
 * Formats a duration in seconds to a human-readable format
 * @param seconds Total duration in seconds
 * @returns Formatted duration string (e.g., "25m", "1h 30m")
 */
export const getHumanReadableDuration = (seconds: number): string => {
  if (!seconds || seconds <= 0) return "0m";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
  }
  
  return `${minutes}m`;
};

/**
 * Converts minutes to seconds
 * @param minutes Number of minutes
 * @returns Number of seconds
 */
export const minutesToSeconds = (minutes: number): number => {
  return minutes * 60;
};

/**
 * Converts seconds to minutes
 * @param seconds Number of seconds
 * @returns Number of minutes
 */
export const secondsToMinutes = (seconds: number): number => {
  return Math.floor(seconds / 60);
};

/**
 * Formats seconds to MM:SS format
 * @param seconds Number of seconds
 * @returns Time in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};
