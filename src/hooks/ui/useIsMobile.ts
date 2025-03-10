
import { useState, useEffect } from 'react';

/**
 * Hook to detect mobile screen sizes
 * 
 * @param breakpoint Optional custom breakpoint in pixels (defaults to 768)
 * @returns boolean indicating if the screen is mobile size
 */
export const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initial check
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Set initial value
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [breakpoint]);

  return isMobile;
};
