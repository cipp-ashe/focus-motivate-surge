
// Re-export the unified hook from its new location
import { useIsMobile } from './ui/useIsMobile';

// Export both for backward compatibility
export { useIsMobile };
export const useMobile = () => useIsMobile();
