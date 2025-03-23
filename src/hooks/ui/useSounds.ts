
import { useCallback } from 'react';

/**
 * Hook for managing sounds in the application
 */
export const useSounds = () => {
  const playSound = useCallback((soundName: string) => {
    // Get the audio element if it exists
    const audio = document.getElementById(`sound-${soundName}`) as HTMLAudioElement;
    
    if (audio) {
      // Reset the audio to the beginning
      audio.currentTime = 0;
      
      // Play the sound
      audio.play().catch(error => {
        console.error(`Error playing sound ${soundName}:`, error);
      });
    } else {
      console.warn(`Sound ${soundName} not found`);
    }
  }, []);
  
  const stopSound = useCallback((soundName: string) => {
    const audio = document.getElementById(`sound-${soundName}`) as HTMLAudioElement;
    
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);
  
  return {
    playSound,
    stopSound
  };
};

export default useSounds;
