
// Define log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Default to INFO in production, DEBUG in development
const DEFAULT_LOG_LEVEL = process.env.NODE_ENV === 'production' 
  ? LOG_LEVELS.INFO 
  : LOG_LEVELS.DEBUG;

// Get log level from localStorage or use default
const getLogLevel = (): number => {
  try {
    const storedLevel = localStorage.getItem('log-level');
    if (storedLevel && !isNaN(Number(storedLevel))) {
      return Number(storedLevel);
    }
  } catch (e) {
    // Ignore localStorage errors
  }
  return DEFAULT_LOG_LEVEL;
};

// Track if event logging is enabled
let eventLoggingEnabled = false;
let moduleFilters: string[] = [];

// Helper to format log messages
const formatLogMessage = (component: string, message: string, data?: any): string => {
  const formattedMessage = `[${component}] ${message}`;
  if (data) {
    try {
      return `${formattedMessage} ${typeof data === 'string' ? data : JSON.stringify(data)}`;
    } catch (e) {
      return `${formattedMessage} [Object cannot be stringified]`;
    }
  }
  return formattedMessage;
};

// Throttle function for high-frequency logs
const throttle = (func: Function, limit: number) => {
  let lastFunc: any;
  let lastRan: number;
  return function(this: any, ...args: any[]) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

// Function to log theme CSS variables for debugging
const logThemeVariables = () => {
  if (getLogLevel() >= LOG_LEVELS.DEBUG) {
    const style = window.getComputedStyle(document.documentElement);
    const themeVars = {
      '--background': style.getPropertyValue('--background'),
      '--foreground': style.getPropertyValue('--foreground'),
      '--card': style.getPropertyValue('--card'),
      '--card-foreground': style.getPropertyValue('--card-foreground'),
      '--primary': style.getPropertyValue('--primary'),
      '--primary-foreground': style.getPropertyValue('--primary-foreground'),
      '--muted': style.getPropertyValue('--muted'),
      '--muted-foreground': style.getPropertyValue('--muted-foreground'),
    };
    
    console.groupCollapsed('%c🎨 Theme Variables', 'font-weight: bold; color: #6366f1;');
    console.table(themeVars);
    console.log('Current theme:', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    console.groupEnd();
  }
};

// Logger utility
export const logger = {
  LOG_LEVELS,
  
  debug: (component: string, message: string, data?: any) => {
    if (getLogLevel() >= LOG_LEVELS.DEBUG) {
      console.log(`%c${formatLogMessage(component, message, data)}`, 'color: #6366f1');
    }
  },
  
  info: (component: string, message: string, data?: any) => {
    if (getLogLevel() >= LOG_LEVELS.INFO) {
      console.info(`%c${formatLogMessage(component, message, data)}`, 'color: #38bdf8; font-weight: bold');
    }
  },
  
  warn: (component: string, message: string, data?: any) => {
    if (getLogLevel() >= LOG_LEVELS.WARN) {
      console.warn(formatLogMessage(component, message, data));
    }
  },
  
  error: (component: string, message: string, error?: any) => {
    if (getLogLevel() >= LOG_LEVELS.ERROR) {
      console.error(formatLogMessage(component, message, error));
    }
  },
  
  // Log events with optional throttling
  logEvent: (component: string, event: string, payload?: any, throttleTime: number = 0) => {
    if (!eventLoggingEnabled) return;
    
    // If module filters exist, only log events for those modules
    if (moduleFilters.length > 0 && !moduleFilters.some(filter => event.includes(filter))) {
      return;
    }
    
    const logFunc = () => {
      console.groupCollapsed(`EVENT: ${event}`);
      console.log('Payload:', payload);
      console.groupEnd();
    };
    
    if (throttleTime > 0) {
      throttle(logFunc, throttleTime)();
    } else {
      logFunc();
    }
  },
  
  // Set log level
  setLogLevel: (level: number) => {
    try {
      localStorage.setItem('log-level', level.toString());
    } catch (e) {
      // Ignore localStorage errors
    }
  },
  
  // Enable/disable event logging
  setEventLogging: (enabled: boolean) => {
    eventLoggingEnabled = enabled;
  },
  
  // Add module filter
  addModuleFilter: (filter: string) => {
    if (!moduleFilters.includes(filter)) {
      moduleFilters.push(filter);
    }
  },
  
  // Clear module filters
  clearModuleFilters: () => {
    moduleFilters = [];
  },
  
  // Get current log level
  getLogLevel,
  
  // Enhanced theme debugging
  logThemeState: () => {
    if (getLogLevel() >= LOG_LEVELS.DEBUG) {
      logThemeVariables();
      
      // Log the computed background color of key elements
      const html = document.documentElement;
      const body = document.body;
      const root = document.getElementById('root');
      
      console.groupCollapsed('%c🔍 Theme Application', 'font-weight: bold; color: #8b5cf6;');
      console.log('HTML element classes:', html.className);
      console.log('HTML background:', window.getComputedStyle(html).backgroundColor);
      console.log('BODY background:', window.getComputedStyle(body).backgroundColor);
      if (root) {
        console.log('ROOT background:', window.getComputedStyle(root).backgroundColor);
      }
      console.groupEnd();
    }
  }
};

// Log theme state when this module loads (helpful for debugging)
setTimeout(() => {
  logger.logThemeState();
}, 500);
