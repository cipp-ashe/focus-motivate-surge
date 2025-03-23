
/**
 * State tracking utilities for debugging
 */
import { DebugModule, IS_DEV } from './types';
import { logDebugEvent } from './logger';

/**
 * Utility to track state changes
 */
export function trackState(
  module: DebugModule,
  component: string,
  stateName: string,
  newValue: any,
  prevValue?: any
): void {
  if (!IS_DEV) return;
  
  logDebugEvent(
    'state-change',
    module,
    component,
    `State '${stateName}' changed`,
    {
      stateName,
      newValue,
      prevValue,
      changed: prevValue !== undefined
    }
  );
}

/**
 * Utility to trace data flow
 */
export function traceData(
  module: DebugModule,
  component: string,
  message: string,
  data?: any
): void {
  if (!IS_DEV) return;
  
  logDebugEvent(
    'data-flow',
    module,
    component,
    message,
    data
  );
}
