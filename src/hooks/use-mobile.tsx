
// Re-export the unified hook from its new location
export { useIsMobile } from './ui/useIsMobile';

// Maintain backward compatibility
export const useMobile = () => useIsMobile();
