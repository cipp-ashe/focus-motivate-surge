
import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useTimerControls } from '../timer/useTimerControls';
import { TimerStateMetrics } from '@/types/metrics';

describe('useTimerControls', () => {
  const mockMetrics: TimerStateMetrics = {
    startTime: null,
    endTime: null,
    pauseCount: 0,
    expectedTime: 300,
    actualDuration: 0,
    favoriteQuotes: 0,
    pausedTime: 0,
    lastPauseTimestamp: null,
    extensionTime: 0,
    netEffectiveTime: 0,
    efficiencyRatio: 0,
    completionStatus: 'Completed On Time',
    isPaused: false,
    pausedTimeLeft: null
  };

  const mockOnStart = vi.fn();
  const mockOnPause = vi.fn();
  const mockOnComplete = vi.fn();
  const mockOnAddTime = vi.fn();
  const initialTimeLeft = 300; // 5 minutes

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct state', () => {
    const { result } = renderHook(() => useTimerControls({
      timeLeft: initialTimeLeft,
      isRunning: false,
      metrics: mockMetrics,
      onStart: mockOnStart,
      onPause: mockOnPause,
      onComplete: mockOnComplete,
      onAddTime: mockOnAddTime
    }));

    expect(result.current.handleToggle).toBeDefined();
    expect(result.current.handleComplete).toBeDefined();
    expect(result.current.handleAddTime).toBeDefined();
  });

  it('should handle toggle correctly when starting', () => {
    const { result } = renderHook(() => useTimerControls({
      timeLeft: initialTimeLeft,
      isRunning: false,
      metrics: mockMetrics,
      onStart: mockOnStart,
      onPause: mockOnPause,
      onComplete: mockOnComplete,
      onAddTime: mockOnAddTime
    }));

    act(() => {
      result.current.handleToggle();
    });

    expect(mockOnStart).toHaveBeenCalled();
  });

  it('should handle toggle correctly when pausing', () => {
    const { result } = renderHook(() => useTimerControls({
      timeLeft: initialTimeLeft,
      isRunning: true,
      metrics: mockMetrics,
      onStart: mockOnStart,
      onPause: mockOnPause,
      onComplete: mockOnComplete,
      onAddTime: mockOnAddTime
    }));

    act(() => {
      result.current.handleToggle();
    });

    expect(mockOnPause).toHaveBeenCalled();
  });

  it('should handle complete correctly', () => {
    const { result } = renderHook(() => useTimerControls({
      timeLeft: initialTimeLeft,
      isRunning: true,
      metrics: mockMetrics,
      onStart: mockOnStart,
      onPause: mockOnPause,
      onComplete: mockOnComplete,
      onAddTime: mockOnAddTime
    }));

    act(() => {
      result.current.handleComplete();
    });

    expect(mockOnComplete).toHaveBeenCalled();
  });
});
