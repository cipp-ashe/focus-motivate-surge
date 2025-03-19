
import { useState, useCallback } from "react";
import { SoundOption } from "@/types/timer";
import { logger } from "@/utils/logManager";

export const useTimerAudio = (selectedSound: SoundOption) => {
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  
  const testSound = useCallback(() => {
    logger.debug('TimerAudio', `Testing sound: ${selectedSound}`);
    setIsLoadingAudio(true);
    // Play the actual sound
    playSound();
    // Reset loading state after a short delay
    setTimeout(() => {
      setIsLoadingAudio(false);
    }, 500);
  }, [selectedSound]);
  
  const playSound = useCallback(() => {
    if (selectedSound === 'none') return;
    
    logger.debug('TimerAudio', `Playing completion sound: ${selectedSound}`);
    try {
      // Create an audio element and play the selected sound
      // Use a fully qualified URL to ensure the sound can be found
      const soundUrl = `${window.location.origin}/sounds/${selectedSound}.mp3`;
      const audio = new Audio(soundUrl);
      audio.volume = 0.7;
      
      // Add error handling for better debugging
      audio.addEventListener('error', (e) => {
        console.error('Error playing sound:', e);
        logger.error('TimerAudio', `Failed to load sound: ${soundUrl}`, e);
      });
      
      // Add success logging
      audio.addEventListener('canplaythrough', () => {
        logger.debug('TimerAudio', `Successfully loaded sound: ${soundUrl}`);
      });
      
      audio.play().catch(error => {
        console.error('Error playing sound:', error);
        logger.error('TimerAudio', `Error playing sound: ${error.message}`);
      });
    } catch (error) {
      console.error('Error creating audio element:', error);
      logger.error('TimerAudio', `Error creating audio element: ${error}`);
    }
  }, [selectedSound]);

  return {
    isLoadingAudio,
    testSound,
    playSound
  };
};
