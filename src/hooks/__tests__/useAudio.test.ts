
import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useAudio } from '../useAudio';

describe('useAudio', () => {
  const mockAudio = {
    load: vi.fn(),
    play: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.Audio = vi.fn().mockImplementation(() => mockAudio);
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAudio({ audioUrl: 'test.mp3' }));
    expect(result.current.isLoadingAudio).toBe(false);
  });

  it('should handle successful audio play', async () => {
    mockAudio.play.mockResolvedValueOnce(undefined);
    const onSuccess = vi.fn();
    
    const { result } = renderHook(() => 
      useAudio({ 
        audioUrl: 'test.mp3', 
        options: { onSuccess } 
      })
    );

    await act(async () => {
      await result.current.play();
    });

    expect(onSuccess).toHaveBeenCalled();
    expect(mockAudio.play).toHaveBeenCalled();
  });

  it('should handle audio play error', async () => {
    const error = new Error('Audio play failed');
    mockAudio.play.mockRejectedValueOnce(error);
    const onError = vi.fn();
    
    const { result } = renderHook(() => 
      useAudio({ 
        audioUrl: 'test.mp3', 
        options: { onError } 
      })
    );

    await act(async () => {
      await result.current.play();
    });

    expect(onError).toHaveBeenCalledWith(error);
  });

  it('should handle test sound with no audio url', () => {
    const { result } = renderHook(() => 
      useAudio({ audioUrl: '' })
    );

    act(() => {
      result.current.testSound();
    });

    expect(mockAudio.play).not.toHaveBeenCalled();
  });
});
