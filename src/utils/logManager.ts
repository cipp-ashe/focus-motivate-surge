
/**
 * Utility for managing and controlling application logging
 */
export class LogManager {
  // Default log levels
  static LOG_LEVELS = {
    NONE: 0,
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    DEBUG: 4,
    VERBOSE: 5,
  };

  private static currentLevel: number = LogManager.LOG_LEVELS.INFO;
  private static isProduction: boolean = process.env.NODE_ENV === 'production';
  private static eventLoggingEnabled: boolean = false;
  private static moduleFilter: Set<string> = new Set();
  
  // Map to track event frequencies for throttling
  private static eventFrequency: Map<string, {
    count: number,
    lastLog: number,
    threshold: number
  }> = new Map();

  /**
   * Set the global log level
   */
  static setLogLevel(level: number): void {
    LogManager.currentLevel = level;
  }

  /**
   * Enable or disable event logging
   */
  static setEventLogging(enabled: boolean): void {
    LogManager.eventLoggingEnabled = enabled;
  }

  /**
   * Add a module to the filter list (only these modules will be logged)
   */
  static addModuleFilter(moduleName: string): void {
    LogManager.moduleFilter.add(moduleName);
  }

  /**
   * Clear all module filters
   */
  static clearModuleFilters(): void {
    LogManager.moduleFilter.clear();
  }

  /**
   * Log a message if the level is appropriate
   */
  static log(level: number, module: string, message: string, ...args: any[]): void {
    // Skip logging in production unless it's an error
    if (LogManager.isProduction && level > LogManager.LOG_LEVELS.ERROR) {
      return;
    }

    // Skip if level is higher than current level
    if (level > LogManager.currentLevel) {
      return;
    }

    // Skip if module filters are active and this module isn't included
    if (LogManager.moduleFilter.size > 0 && !LogManager.moduleFilter.has(module)) {
      return;
    }

    const prefix = `[${module}]`;

    switch (level) {
      case LogManager.LOG_LEVELS.ERROR:
        console.error(prefix, message, ...args);
        break;
      case LogManager.LOG_LEVELS.WARN:
        console.warn(prefix, message, ...args);
        break;
      case LogManager.LOG_LEVELS.INFO:
        console.info(prefix, message, ...args);
        break;
      case LogManager.LOG_LEVELS.DEBUG:
      case LogManager.LOG_LEVELS.VERBOSE:
      default:
        console.log(prefix, message, ...args);
        break;
    }
  }

  /**
   * Log event information with throttling for high-frequency events
   */
  static logEvent(module: string, eventType: string, payload?: any, throttleMs: number = 0): void {
    if (!LogManager.eventLoggingEnabled && throttleMs === 0) {
      return;
    }

    const now = Date.now();
    const eventKey = `${module}:${eventType}`;

    // Check if we need to throttle this event
    if (throttleMs > 0) {
      if (!LogManager.eventFrequency.has(eventKey)) {
        LogManager.eventFrequency.set(eventKey, {
          count: 1,
          lastLog: now,
          threshold: throttleMs
        });
      } else {
        const event = LogManager.eventFrequency.get(eventKey)!;
        event.count++;

        // Only log if threshold time has passed
        if (now - event.lastLog < event.threshold) {
          return;
        }

        // Update the last log time
        event.lastLog = now;

        // If we're logging, include the count of throttled events
        if (event.count > 1) {
          LogManager.log(
            LogManager.LOG_LEVELS.DEBUG,
            module,
            `Event: ${eventType} (throttled, ${event.count} occurrences)`,
            payload
          );
          event.count = 0;
          return;
        }
      }
    }

    // Normal logging for non-throttled events or throttled events that passed the threshold
    LogManager.log(
      LogManager.LOG_LEVELS.DEBUG,
      module,
      `Event: ${eventType}`,
      payload
    );
  }

  // Convenience methods
  static error(module: string, message: string, ...args: any[]): void {
    LogManager.log(LogManager.LOG_LEVELS.ERROR, module, message, ...args);
  }

  static warn(module: string, message: string, ...args: any[]): void {
    LogManager.log(LogManager.LOG_LEVELS.WARN, module, message, ...args);
  }

  static info(module: string, message: string, ...args: any[]): void {
    LogManager.log(LogManager.LOG_LEVELS.INFO, module, message, ...args);
  }

  static debug(module: string, message: string, ...args: any[]): void {
    LogManager.log(LogManager.LOG_LEVELS.DEBUG, module, message, ...args);
  }

  static verbose(module: string, message: string, ...args: any[]): void {
    LogManager.log(LogManager.LOG_LEVELS.VERBOSE, module, message, ...args);
  }
}

// Create a convenience export
export const logger = LogManager;

// Initialize with appropriate settings for the environment
if (process.env.NODE_ENV !== 'production') {
  // In development, enable more detailed logging by default
  logger.setLogLevel(logger.LOG_LEVELS.DEBUG);
  
  // Add development console commands
  if (typeof window !== 'undefined') {
    (window as any).setLogLevel = (level: number) => {
      logger.setLogLevel(level);
      console.log(`Log level set to ${level}`);
    };
    
    (window as any).enableEventLogging = (enabled: boolean = true) => {
      logger.setEventLogging(enabled);
      console.log(`Event logging ${enabled ? 'enabled' : 'disabled'}`);
    };

    (window as any).filterLogModule = (moduleName: string) => {
      logger.addModuleFilter(moduleName);
      console.log(`Added log filter for module: ${moduleName}`);
    };

    (window as any).clearLogFilters = () => {
      logger.clearModuleFilters();
      console.log('Cleared all log module filters');
    };
  }
}
