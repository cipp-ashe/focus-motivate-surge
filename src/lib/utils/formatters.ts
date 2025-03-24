
/**
 * Utility functions for formatting values
 */

// Format a duration in seconds to a readable format
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} seconds`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes < 60) {
    return remainingSeconds > 0
      ? `${minutes} min ${remainingSeconds} sec`
      : `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes > 0) {
    return `${hours} hr ${remainingMinutes} min`;
  }
  
  return `${hours} hr`;
};

// Format a timestamp to a readable format
export const formatTimestamp = (timestamp: string | Date): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Format a percentage value
export const formatPercentage = (value: number, decimalPlaces = 0): string => {
  return `${value.toFixed(decimalPlaces)}%`;
};

// Format time (hours:minutes)
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Format a time display for timer (MM:SS)
export const formatTimeDisplay = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Get CSS class based on completion timing
export const getCompletionTimingClass = (
  actualDuration: number,
  expectedDuration: number
): string => {
  if (!actualDuration || !expectedDuration) return '';
  
  const ratio = actualDuration / expectedDuration;
  
  if (ratio <= 0.8) return 'text-green-500 dark:text-green-400';
  if (ratio <= 1.1) return 'text-blue-500 dark:text-blue-400';
  if (ratio <= 1.5) return 'text-amber-500 dark:text-amber-400';
  return 'text-red-500 dark:text-red-400';
};

// Format a date to a specific format - compatible with date-fns
export const formatDate = (date: Date | string, format = 'MMM d, yyyy'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Simple formatting function that handles common patterns
  // In a real app, you would use date-fns or another library
  const options: Intl.DateTimeFormatOptions = {};
  
  if (format.includes('yyyy')) options.year = 'numeric';
  if (format.includes('yy')) options.year = '2-digit';
  if (format.includes('MMM')) options.month = 'short';
  if (format.includes('MM')) options.month = '2-digit';
  if (format.includes('d')) options.day = 'numeric';
  if (format.includes('HH')) {
    options.hour = '2-digit';
    options.hour12 = false;
  }
  if (format.includes('mm')) options.minute = '2-digit';
  
  return d.toLocaleString('en-US', options);
};
