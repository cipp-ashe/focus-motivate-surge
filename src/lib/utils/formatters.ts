
/**
 * Format a duration in seconds to a time display (mm:ss)
 */
export const formatTimeDisplay = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format a percentage value for display
 */
export const formatPercentage = (value: number): string => {
  return `${Math.round(value * 100)}%`;
};

/**
 * Format a timestamp for display
 */
export const formatTimestamp = (timestamp: string | Date | null): string => {
  if (!timestamp) return '';
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return date.toLocaleString();
};

/**
 * Get a CSS class based on completion timing
 */
export const getCompletionTimingClass = (efficiency: number): string => {
  if (efficiency >= 1.1) return 'text-red-500';
  if (efficiency > 0.9 && efficiency < 1.1) return 'text-green-500';
  return 'text-yellow-500';
};

/**
 * Determine completion status based on expected and actual times
 */
export const determineCompletionStatus = (expectedTime: number, actualTime: number): string => {
  const ratio = actualTime / expectedTime;
  
  if (ratio < 0.8) return 'Early';
  if (ratio > 1.2) return 'Late';
  return 'On Time';
};

/**
 * Calculate efficiency ratio (actual/expected)
 */
export const calculateEfficiencyRatio = (expectedTime: number, actualTime: number): number => {
  if (expectedTime === 0) return 1.0;
  return parseFloat((actualTime / expectedTime).toFixed(2));
};

/**
 * Format a duration in a readable way
 */
export const formatDuration = (seconds: number): string => {
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

