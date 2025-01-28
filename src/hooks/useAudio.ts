import { useCallback } from "react";
import { toast } from "sonner";
import { useLoadingState } from "./useLoadingState";

interface UseAudioOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useAudio = (audioUrl: string, options: UseAudioOptions = {}) => {
  const { isLoading, wrapPromise } = useLoadingState({
    errorMessage: "Could not play sound. Please check your browser settings.",
    successMessage: "Sound played successfully!"
  });

  const play = useCallback(async () => {
    if (!audioUrl) return;

    try {
      const audio = new Audio(audioUrl);
      await wrapPromise(audio.play());
      options.onSuccess?.();
    } catch (error) {
      console.error("Error playing sound:", error);
      const err = error instanceof Error ? error : new Error("Failed to play sound");
      options.onError?.(err);
    }
  }, [audioUrl, options, wrapPromise]);

  const testSound = useCallback(() => {
    if (!audioUrl) {
      toast("No sound selected");
      return;
    }
    play();
  }, [audioUrl, play]);

  return {
    play,
    testSound,
    isLoadingAudio: isLoading
  };
};