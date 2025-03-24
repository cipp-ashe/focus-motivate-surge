
import React from 'react';
import { deprecate } from './deprecation';

/**
 * HOC to create deprecated versions of components
 */
export function deprecateComponent<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string,
  replacementInfo: string
): React.FC<P> {
  const DeprecatedComponent: React.FC<P> = (props) => {
    deprecate(
      componentName,
      'Component usage',
      replacementInfo
    );
    
    return <Component {...props} />;
  };
  
  // Update displayName for debugging
  DeprecatedComponent.displayName = `Deprecated(${componentName})`;
  
  return DeprecatedComponent;
}

/**
 * Utility for tracking component usage in the development environment
 */
export function trackComponentUsage<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.FC<P> {
  if (process.env.NODE_ENV === 'production') {
    return Component as React.FC<P>;
  }
  
  const TrackedComponent: React.FC<P> = (props) => {
    console.log(`[Component Usage] ${componentName} rendered`);
    return <Component {...props} />;
  };
  
  TrackedComponent.displayName = `Tracked(${componentName})`;
  
  return TrackedComponent;
}

/**
 * Create a component with migration warning for props
 */
export function warnOnDeprecatedProps<P extends object, D extends keyof P>(
  Component: React.ComponentType<P>,
  componentName: string,
  deprecatedProps: Record<D, string>
): React.FC<P> {
  const WarningComponent: React.FC<P> = (props) => {
    // Check for deprecated props
    Object.entries(deprecatedProps).forEach(([propName, message]) => {
      if (propName in props) {
        deprecate(
          componentName,
          `Prop '${propName}'`,
          message
        );
      }
    });
    
    return <Component {...props} />;
  };
  
  WarningComponent.displayName = `PropWarnings(${componentName})`;
  
  return WarningComponent;
}
