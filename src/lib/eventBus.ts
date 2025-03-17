
/**
 * MIGRATION UTILITY: This file exists only to assist with migration.
 * Import it in files that still depend on the old eventBus to get explicit errors,
 * then update those files to use eventManager instead.
 */
import { reportEventBusImport } from './events/migrationUtils';

// Simple component name detection from stack trace
const getComponentName = () => {
  const stack = new Error().stack || '';
  const matches = stack.match(/at\s([A-Za-z0-9_]+)\s/);
  return matches && matches[1] ? matches[1] : 'Unknown Component';
};

// Create a proxy that throws helpful errors when accessed
const eventBusProxy = new Proxy({}, {
  get: (_target, prop) => {
    const componentName = getComponentName();
    reportEventBusImport(componentName);
    throw new Error(`eventBus has been removed. Use eventManager in ${componentName}`);
  }
});

export const eventBus = eventBusProxy;
