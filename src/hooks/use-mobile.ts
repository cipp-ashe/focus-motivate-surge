
// This file is deprecated and just re-exports from the new location
import { useIsMobile } from './ui/useIsMobile';

// For backward compatibility
export function useMobile() {
  return useIsMobile();
}
