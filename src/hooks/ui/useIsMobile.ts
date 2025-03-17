
import { useState, useEffect } from 'react';

/**
 * A unified hook to detect mobile screen sizes with configurable breakpoint
 * This replaces multiple implementations of mobile detection across the app
 * 
 * @param breakpoint Optional custom breakpoint in pixels (defaults to 768)
 * @returns boolean indicating if the screen is mobile size
 */
export const useIsMobile = (breakpoint: number = 768): boolean => {
  // Using null as initial state avoids hydration mismatch
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Initial check function
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Set initial value
    checkMobile();

    // Add event listener for window resize with throttling
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        checkMobile();
      }, 100); // Throttle to avoid excessive updates
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [breakpoint]);

  return isMobile;
};

// Also export it as useMobile for backward compatibility
export const useMobile = useIsMobile;
