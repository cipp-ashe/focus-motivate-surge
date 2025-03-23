
/**
 * Calculate the efficiency ratio of a timer session
 */
export const calculateEfficiencyRatio = (
  expectedTime: number, 
  actualTime: number
): number => {
  if (expectedTime <= 0 || actualTime <= 0) {
    return 1.0;
  }
  
  // A ratio of 1.0 means the timer completed right on time
  // < 1.0 means it took less time than expected
  // > 1.0 means it took more time than expected
  return actualTime / expectedTime;
};

/**
 * Determine the completion status based on efficiency ratio
 */
export const determineCompletionStatus = (
  expectedTime: number, 
  actualTime: number
): string => {
  const ratio = calculateEfficiencyRatio(expectedTime, actualTime);
  
  if (ratio < 0.9) {
    return 'Completed Quickly';
  } else if (ratio <= 1.1) {
    return 'Completed On Time';
  } else if (ratio <= 1.5) {
    return 'Slightly Delayed';
  } else {
    return 'Significantly Delayed';
  }
};

/**
 * Format seconds into MM:SS format
 */
export const formatTimeMMSS = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format seconds into human readable format (e.g., "1h 30m")
 */
export const formatTimeHuman = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};
