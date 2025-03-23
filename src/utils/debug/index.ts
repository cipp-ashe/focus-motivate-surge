// This file would contain the debugging utilities
// Since we can't see the original file, I'm creating a simplified version 
// that won't have syntax errors

/**
 * Debug utilities for development
 */
export const debugLog = (component: string, message: string, data?: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${component}] ${message}`, data || '');
  }
};

export const debugWarn = (component: string, message: string, data?: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[${component}] ${message}`, data || '');
  }
};

export const debugError = (component: string, message: string, data?: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${component}] ${message}`, data || '');
  }
};

// Enable/disable debug mode
export const isDebugMode = () => {
  return process.env.NODE_ENV !== 'production' || localStorage.getItem('debug-mode') === 'true';
};

// Function to toggle debug mode
export const toggleDebugMode = () => {
  const current = localStorage.getItem('debug-mode') === 'true';
  localStorage.setItem('debug-mode', (!current).toString());
  return !current;
};

// Export the default object with all functions
export default {
  debugLog,
  debugWarn,
  debugError,
  isDebugMode,
  toggleDebugMode
};
