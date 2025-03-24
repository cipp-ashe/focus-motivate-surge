
/**
 * Deprecation utilities to help with code migration and refactoring
 */

// Configuration options
const DEPRECATION_CONFIG = {
  logToConsole: true,
  throwErrors: false,
  trackStackTraces: true,
  silent: false, // Set to true to disable all warnings (for production)
};

// Track which deprecations have been logged to avoid console spam
const loggedDeprecations = new Set<string>();

// Store statistics about deprecation usage
interface DeprecationStats {
  count: number;
  lastUsed: number;
  locations: string[];
}

// Global registry of all deprecation usage
const usageRegistry: Record<string, DeprecationStats> = {};

/**
 * Log a deprecation warning with a migration path
 */
export function deprecate(
  componentName: string,
  whatIsDeprecated: string,
  migrationPath: string,
  code?: string
): void {
  if (DEPRECATION_CONFIG.silent) return;

  const key = `${componentName}:${whatIsDeprecated}`;
  
  // Update usage statistics
  if (!usageRegistry[key]) {
    usageRegistry[key] = {
      count: 0,
      lastUsed: Date.now(),
      locations: [],
    };
  }
  
  usageRegistry[key].count++;
  usageRegistry[key].lastUsed = Date.now();
  
  // Only log each unique deprecation once per session to reduce noise
  if (DEPRECATION_CONFIG.logToConsole && !loggedDeprecations.has(key)) {
    loggedDeprecations.add(key);
    
    // Build warning message
    const warning = [
      `%c[DEPRECATED] ${componentName}: ${whatIsDeprecated} is deprecated and will be removed in a future version.`,
      `%cMigration path: ${migrationPath}`,
    ];
    
    // Get stack trace for debugging
    const stack = DEPRECATION_CONFIG.trackStackTraces ? new Error().stack : null;
    
    // Log with styling
    console.warn(
      warning[0],
      'color: white; font-weight: bold; background-color: red; padding: 2px 5px;',
      'color: black; font-weight: bold;',
      '\nStack trace:',
      stack
    );
    
    // Store unique calling locations
    if (stack && usageRegistry[key].locations.indexOf(stack) === -1) {
      usageRegistry[key].locations.push(stack);
    }
    
    // Optionally throw errors in development to catch issues early
    if (DEPRECATION_CONFIG.throwErrors && process.env.NODE_ENV === 'development') {
      throw new Error(`Using deprecated API: ${componentName}.${whatIsDeprecated}`);
    }
  }
}

/**
 * Create a deprecated version of a function that warns when used
 */
export function deprecateFunction<T extends (...args: any[]) => any>(
  originalFn: T,
  componentName: string,
  functionName: string,
  migrationPath: string
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    deprecate(componentName, functionName, migrationPath);
    return originalFn(...args);
  }) as T;
}

/**
 * Create a deprecated property accessor
 */
export function createDeprecatedProp<T>(
  value: T,
  componentName: string,
  propName: string, 
  migrationPath: string
): { get(): T } {
  return {
    get(): T {
      deprecate(componentName, propName, migrationPath);
      return value;
    }
  };
}

/**
 * Get deprecation usage statistics
 */
export function getDeprecationStats(): Record<string, DeprecationStats> {
  return { ...usageRegistry };
}

/**
 * Reset deprecation statistics (mainly for testing)
 */
export function resetDeprecationStats(): void {
  Object.keys(usageRegistry).forEach(key => {
    delete usageRegistry[key];
  });
  loggedDeprecations.clear();
}

/**
 * Configure deprecation behavior
 */
export function configureDeprecation(options: Partial<typeof DEPRECATION_CONFIG>): void {
  Object.assign(DEPRECATION_CONFIG, options);
}
