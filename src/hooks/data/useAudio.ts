
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAudioOptions {
  preload?: boolean;
  volume?: number;
  loop?: boolean;
}

export const useAudio = (src: string, options: UseAudioOptions = {}) => {
  const { preload = true, volume = 1, loop = false } = options;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(src);
    audio.volume = Math.min(Math.max(volume, 0), 1); // Ensure volume is between 0 and 1
    audio.loop = loop;
    audioRef.current = audio;

    const handleCanPlayThrough = () => {
      setIsLoaded(true);
      setError(null);
    };

    const handleError = () => {
      setIsLoaded(false);
      setError(`Failed to load audio: ${src}`);
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleError);

    if (preload) {
      audio.load();
    }

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audioRef.current = null;
    };
  }, [src, volume, loop, preload]);

  // Handle play/pause
  const play = useCallback(() => {
    if (!audioRef.current) return;
    
    // Create a promise to handle autoplay restrictions
    const playPromise = audioRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Audio playback failed:', error);
          setError('Playback failed. User interaction may be required.');
          setIsPlaying(false);
        });
    }
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  }, []);

  // Set volume
  const setAudioVolume = useCallback((newVolume: number) => {
    if (!audioRef.current) return;
    const clampedVolume = Math.min(Math.max(newVolume, 0), 1);
    audioRef.current.volume = clampedVolume;
  }, []);

  return {
    isPlaying,
    isLoaded,
    error,
    play,
    pause,
    stop,
    setVolume: setAudioVolume,
  };
};
