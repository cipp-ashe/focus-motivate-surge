
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
): string => {
  if (expectedSeconds <= 0) return 'Completed';
  
  const efficiency = calculateEfficiencyRatio(expectedSeconds, actualSeconds);
  
  if (efficiency >= 1.5) return 'Completed Very Early';
  if (efficiency >= 1.2) return 'Completed Early';
  if (efficiency >= 0.8) return 'Completed On Time';
  if (efficiency >= 0.5) return 'Completed Late';
  return 'Completed Very Late';
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
 * Formats a date to a relative time string (e.g., "2 days ago")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInMilliseconds = now.getTime() - targetDate.getTime();
  
  // Convert to seconds
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  // Convert to minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  // Convert to hours
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Convert to days
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  // Convert to months
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }
  
  // Convert to years
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
};
