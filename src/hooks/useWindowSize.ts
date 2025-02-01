import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    console.log("Setting up resize listener");
    window.addEventListener('resize', handleResize);
    
    return () => {
      console.log("Cleaning up resize listener");
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
};