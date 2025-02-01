import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    console.log("Setting up resize listener");
    window.addEventListener('resize', handleResize);
    
    // Initial size set
    handleResize();
    
    return () => {
      console.log("Cleaning up resize listener");
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
};