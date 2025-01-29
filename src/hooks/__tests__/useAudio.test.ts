import { describe, test, expect } from '../../testUtils/testRunner';
import { useAudio } from '../useAudio';
import { createHookTester } from '../../testUtils/hookTester';

const createAudioTester = createHookTester(useAudio);

describe('useAudio', () => {
  const validAudioUrl = 'https://example.com/audio.mp3';
  
  test('initializes with correct loading state', () => {
    const { result } = createAudioTester({ audioUrl: validAudioUrl });
    expect(result.isLoadingAudio).toBeFalsy();
  });

  test('handles successful audio play', () => {
    let successCalled = false;
    const { result } = createAudioTester({
      audioUrl: validAudioUrl,
      options: {
        onSuccess: () => { successCalled = true; }
      }
    });

    result.play();
    expect(successCalled).toBeTruthy();
    expect(result.isLoadingAudio).toBeFalsy();
  });

  test('handles empty audio URL', () => {
    const { result } = createAudioTester({ audioUrl: '' });
    result.play();
    expect(result.isLoadingAudio).toBeFalsy();
  });

  test('handles test sound with empty audio', () => {
    const { result } = createAudioTester({ audioUrl: '' });
    result.testSound();
    expect(result.isLoadingAudio).toBeFalsy();
  });

  test('shows loading state during play', () => {
    const { result } = createAudioTester({ audioUrl: validAudioUrl });
    
    // Mock async play
    let playResolved = false;
    const originalPlay = result.play;
    result.play = async () => {
      expect(result.isLoadingAudio).toBeTruthy();
      await originalPlay();
      playResolved = true;
    };

    result.play();
    expect(playResolved).toBeFalsy();
    expect(result.isLoadingAudio).toBeTruthy();
  });

  test('handles error during play', () => {
    let errorCalled = false;
    const { result } = createAudioTester({
      audioUrl: validAudioUrl,
      options: {
        onError: () => { errorCalled = true; }
      }
    });

    // Force an error
    const audio = new Audio(validAudioUrl);
    audio.play = () => Promise.reject(new Error('Audio failed'));

    result.play();
    expect(errorCalled).toBeTruthy();
    expect(result.isLoadingAudio).toBeFalsy();
  });

  test('cleans up audio resources', () => {
    const { result, rerender } = createAudioTester({
      audioUrl: validAudioUrl
    });
    
    result.play();
    rerender(); // Simulate unmount
    expect(result.isLoadingAudio).toBeFalsy();
  });

  test('supports multiple audio plays', () => {
    const { result } = createAudioTester({
      audioUrl: validAudioUrl
    });
    
    result.play();
    expect(result.isLoadingAudio).toBeTruthy();
    
    result.play();
    expect(result.isLoadingAudio).toBeTruthy();
  });

  test('handles invalid audio URLs', () => {
    let errorCalled = false;
    const { result } = createAudioTester({
      audioUrl: 'invalid://url',
      options: {
        onError: () => { errorCalled = true; }
      }
    });

    result.play();
    expect(errorCalled).toBeTruthy();
    expect(result.isLoadingAudio).toBeFalsy();
  });

  test('respects options change', () => {
    let successCount = 0;
    const { result } = createAudioTester({
      audioUrl: validAudioUrl,
      options: {
        onSuccess: () => { successCount++; }
      }
    });

    result.play();
    expect(successCount).toBe(1);

    // Change options
    const newOptions = {
      onSuccess: () => { successCount += 2; }
    };
    
    // Simulate options update
    result.play();
    expect(successCount).toBe(3);
  });
});