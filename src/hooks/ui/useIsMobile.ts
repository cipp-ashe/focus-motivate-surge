
import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current device is a mobile device
 * @param breakpoint Optional breakpoint at which to consider the device mobile (defaults to 768)
 * @returns boolean indicating if the device is mobile
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', checkMobile);
    checkMobile(); // Check on mount
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}

// For backward compatibility
export const useMobile = useIsMobile;
