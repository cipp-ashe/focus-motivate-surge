
// Debug utility functions for development and troubleshooting
import React from 'react';
import { logger } from '@/utils/logManager';

/**
 * Helper function to add debugging information to a component
 * @param Component The component to add debugging to
 * @param debugName The name to use for debugging
 */
export function withDebugging<P extends object>(
  Component: React.ComponentType<P>,
  debugName: string
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => {
    logger.debug(debugName, 'Rendering component', { props });
    
    return <Component {...props} />;
  };
  
  WrappedComponent.displayName = `Debug(${debugName})`;
  return WrappedComponent;
}

/**
 * Creates a debug logger for a specific component or module
 * @param namespace The namespace to use for logging
 */
export function createDebugLogger(namespace: string) {
  return {
    log: (...args: any[]) => logger.debug(namespace, ...args),
    warn: (...args: any[]) => logger.warn(namespace, ...args),
    error: (...args: any[]) => logger.error(namespace, ...args),
    info: (...args: any[]) => logger.info(namespace, ...args),
  };
}

/**
 * Simple component that displays debug information
 */
export const DebugDisplay: React.FC<{
  title?: string;
  data: Record<string, any>;
  expanded?: boolean;
}> = ({ title = 'Debug Info', data, expanded = false }) => {
  const [isExpanded, setIsExpanded] = React.useState(expanded);
  
  return (
    <div className="p-2 mt-2 mb-2 border border-gray-300 rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-left">
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h4 className="text-sm font-medium">{title}</h4>
        <span>{isExpanded ? '▼' : '►'}</span>
      </div>
      
      {isExpanded && (
        <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-auto max-h-64">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

/**
 * Utility to conditionally apply debugging features based on environment
 */
export const createDebugger = (namespace: string) => {
  const isDev = process.env.NODE_ENV === 'development';
  
  return {
    log: isDev ? (...args: any[]) => logger.debug(namespace, ...args) : () => {},
    trace: isDev ? (...args: any[]) => console.trace(namespace, ...args) : () => {},
    group: isDev ? (label: string) => console.group(label) : () => {},
    groupEnd: isDev ? () => console.groupEnd() : () => {},
    time: isDev ? (label: string) => console.time(label) : () => {},
    timeEnd: isDev ? (label: string) => console.timeEnd(label) : () => {},
    count: isDev ? (label: string) => console.count(label) : () => {},
  };
};

/**
 * Hook for monitoring prop changes
 */
export function useDebugProps<T extends Record<string, any>>(name: string, props: T) {
  const prevPropsRef = React.useRef<T | null>(null);
  
  React.useEffect(() => {
    if (prevPropsRef.current) {
      const allKeys = new Set([
        ...Object.keys(prevPropsRef.current),
        ...Object.keys(props)
      ]);
      
      const changedProps: Record<string, { from: any; to: any }> = {};
      
      allKeys.forEach(key => {
        if (prevPropsRef.current?.[key] !== props[key]) {
          changedProps[key] = {
            from: prevPropsRef.current?.[key],
            to: props[key]
          };
        }
      });
      
      if (Object.keys(changedProps).length > 0) {
        logger.debug(name, 'Props changed:', changedProps);
      }
    }
    
    prevPropsRef.current = { ...props };
  }, [name, props]);
}

/**
 * Debug helper for rendering cycles
 */
export function useRenderDebug(componentName: string) {
  const renderCount = React.useRef(0);
  
  logger.debug(
    componentName,
    `Render ${++renderCount.current}`
  );
  
  React.useEffect(() => {
    logger.debug(componentName, 'Component mounted');
    
    return () => {
      logger.debug(componentName, 'Component unmounted');
    };
  }, [componentName]);
}

/**
 * Utility function to validate props against a schema
 */
export function validateProps<T>(props: T, schema: Record<keyof T, any>, componentName: string): boolean {
  const errors: string[] = [];
  
  Object.keys(schema).forEach((key) => {
    const propKey = key as keyof T;
    const rule = schema[propKey];
    
    if (rule.required && (props[propKey] === undefined || props[propKey] === null)) {
      errors.push(`Missing required prop '${String(propKey)}'`);
    }
    
    if (props[propKey] !== undefined && rule.type && typeof props[propKey] !== rule.type) {
      errors.push(`Prop '${String(propKey)}' should be of type '${rule.type}', got '${typeof props[propKey]}'`);
    }
  });
  
  if (errors.length > 0) {
    logger.error(componentName, 'Prop validation errors:', errors);
    return false;
  }
  
  return true;
}

// Export a debugging flag for development features
export const DEBUG_MODE = process.env.NODE_ENV === 'development';
