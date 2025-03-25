
/**
 * Centralized logging utility that can be turned on/off based on environment
 */

// Default log level based on environment
const DEFAULT_LOG_LEVEL = import.meta.env.DEV ? 'debug' : 'error';

// Log levels
type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

// Current log level
let currentLogLevel: LogLevel = DEFAULT_LOG_LEVEL;

// Whether to persist logs to localStorage
const PERSIST_LOGS = false;
const MAX_PERSISTED_LOGS = 100;

// Log history if persistence is enabled
const logHistory: Array<{
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  data?: any;
}> = [];

/**
 * Determine if a log should be shown based on the current log level
 */
const shouldLog = (level: LogLevel): boolean => {
  const levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    none: 4
  };
  
  return levels[level] >= levels[currentLogLevel];
};

/**
 * Central logger object with methods for different log levels
 */
export const logger = {
  setLevel(level: LogLevel) {
    currentLogLevel = level;
    console.log(`Log level set to: ${level}`);
  },
  
  debug(module: string, message: string, ...data: any[]) {
    if (!shouldLog('debug')) return;
    
    console.debug(`[${module}] ${message}`, ...data);
    this.persistLog('debug', module, message, data);
  },
  
  info(module: string, message: string, ...data: any[]) {
    if (!shouldLog('info')) return;
    
    console.info(`[${module}] ${message}`, ...data);
    this.persistLog('info', module, message, data);
  },
  
  warn(module: string, message: string, ...data: any[]) {
    if (!shouldLog('warn')) return;
    
    console.warn(`[${module}] ${message}`, ...data);
    this.persistLog('warn', module, message, data);
  },
  
  error(module: string, message: string, ...data: any[]) {
    if (!shouldLog('error')) return;
    
    console.error(`[${module}] ${message}`, ...data);
    this.persistLog('error', module, message, data);
  },
  
  persistLog(level: LogLevel, module: string, message: string, data?: any) {
    if (!PERSIST_LOGS) return;
    
    // Add to history
    logHistory.push({
      timestamp: new Date().toISOString(),
      level,
      module,
      message,
      data: data || undefined
    });
    
    // Trim history if it's getting too long
    if (logHistory.length > MAX_PERSISTED_LOGS) {
      logHistory.splice(0, logHistory.length - MAX_PERSISTED_LOGS);
    }
    
    // Persist to localStorage
    try {
      localStorage.setItem('app_logs', JSON.stringify(logHistory));
    } catch (e) {
      // If localStorage fails, just ignore
    }
  },
  
  getLogHistory() {
    return [...logHistory];
  },
  
  clearLogHistory() {
    logHistory.length = 0;
    try {
      localStorage.removeItem('app_logs');
    } catch (e) {
      // If localStorage fails, just ignore
    }
  }
};

// Initialize logger and load any persisted logs
if (PERSIST_LOGS) {
  try {
    const savedLogs = localStorage.getItem('app_logs');
    if (savedLogs) {
      const parsed = JSON.parse(savedLogs);
      if (Array.isArray(parsed)) {
        logHistory.push(...parsed);
      }
    }
  } catch (e) {
    // If loading fails, just start with empty history
  }
}

// Set log level from localStorage if available
try {
  const savedLevel = localStorage.getItem('log_level');
  if (savedLevel && ['debug', 'info', 'warn', 'error', 'none'].includes(savedLevel)) {
    currentLogLevel = savedLevel as LogLevel;
  }
} catch (e) {
  // If loading fails, use default
}
