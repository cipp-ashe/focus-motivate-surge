
// Re-export all hook categories
export * from './data';
export * from './habits';
export * from './tasks';
export * from './timer';
export * from './ui';

// For backward compatibility - these should eventually be moved
// to their proper modules and removed from here
export { useTheme } from './useTheme';
export { useEventBus } from './useEventBus';
export { useMinutesHandlers } from './useMinutesHandlers';
export { useIsMobile, useMobile } from './use-mobile';
