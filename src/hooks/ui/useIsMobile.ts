
import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current device is mobile based on screen width
 * @returns boolean indicating if the device is mobile
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    
    // Initial check
    handleResize();
    
    // Set up event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
