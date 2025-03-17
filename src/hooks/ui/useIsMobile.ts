
import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current device is mobile based on screen width
 * @param breakpoint - Optional custom breakpoint in pixels (defaults to 768)
 * @returns boolean indicating if the device is mobile
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setIsMobile(window.innerWidth < breakpoint);
    }
    
    // Initial check
    handleResize();
    
    // Set up event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}
