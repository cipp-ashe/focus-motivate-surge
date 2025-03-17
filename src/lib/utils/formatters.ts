
/**
 * Formats a number of seconds into a display string (MM:SS)
 */
export const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Calculates efficiency ratio based on expected vs actual time
 */
export const calculateEfficiencyRatio = (
  expectedSeconds: number, 
  actualSeconds: number
): number => {
  if (expectedSeconds <= 0) return 1;
  
  // Cap efficiency at reasonable limits
  const ratio = expectedSeconds / Math.max(1, actualSeconds);
  return Math.min(Math.max(ratio, 0.1), 2);
};

/**
 * Determines a qualitative completion status based on efficiency
 */
export const determineCompletionStatus = (
  expectedSeconds: number,
  actualSeconds: number
): 'Completed Early' | 'Completed On Time' | 'Completed Late' => {
  if (expectedSeconds <= 0) return 'Completed On Time';
  
  const efficiency = calculateEfficiencyRatio(expectedSeconds, actualSeconds);
  
  if (efficiency >= 1.5) return 'Completed Early';
  if (efficiency >= 0.8) return 'Completed On Time';
  return 'Completed Late';
};

/**
 * Formats a duration in seconds to a human-readable string
 */
export const formatDuration = (durationInSeconds: number): string => {
  if (durationInSeconds < 60) {
    return `${durationInSeconds} seconds`;
  }
  
  const minutes = Math.floor(durationInSeconds / 60);
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  
  return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`;
};

/**
 * Formats a value as a percentage (adds % sign)
 */
export const formatPercentage = (value: number): string => {
  const percentage = Math.round(value * 100);
  return `${percentage}%`;
};

/**
 * Formats a timestamp to a more readable string
 */
export const formatTimestamp = (timestamp: string | Date): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Formats a date based on the current locale
 */
export const formatDateLocalized = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(undefined, options);
};

/**
 * Returns a CSS class based on completion status
 */
export const getCompletionTimingClass = (status: string): string => {
  if (status.includes('Early')) return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200/30';
  if (status.includes('On Time')) return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/30';
  if (status.includes('Late')) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/30';
  return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200/30';
};

/**
 * Alias for calculating efficiency ratio as a percentage
 */
export const calculateEfficiencyPercentage = (
  expectedSeconds: number, 
  actualSeconds: number
): number => {
  return calculateEfficiencyRatio(expectedSeconds, actualSeconds) * 100;
};
