import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseAudioOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseAudioConfig {
  audioUrl: string;
  options?: UseAudioOptions;
}

export function useAudio({ audioUrl, options }: UseAudioConfig) {
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const play = useCallback(async () => {
    if (!audioUrl) return;

    setIsLoadingAudio(true);
    try {
      const audio = new Audio(audioUrl);
      await audio.play();
      setIsLoadingAudio(false);
      options?.onSuccess?.();
    } catch (error) {
      setIsLoadingAudio(false);
      console.error('Error playing sound:', error);
      const err = error instanceof Error ? error : new Error('Failed to play sound');
      options?.onError?.(err);
      toast.error('Could not play sound. Please check your browser settings.');
    }
  }, [audioUrl, options]);

  const testSound = useCallback(() => {
    if (!audioUrl) {
      toast('No sound selected');
      return;
    }
    play();
  }, [audioUrl, play]);

  return {
    play,
    testSound,
    isLoadingAudio,
  };
}