
import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useTimerMetrics } from '../timer/useTimerMetrics';

describe('useTimerMetrics', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useTimerMetrics(300));

    expect(result.current.metrics).toEqual(expect.objectContaining({
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
      pausedTimeLeft: null,
    }));
  });

  it('should update metrics correctly', () => {
    const { result } = renderHook(() => useTimerMetrics(300));

    act(() => {
      result.current.updateMetrics({
        startTime: new Date(),
        isPaused: true,
      });
    });

    expect(result.current.metrics.startTime).toBeDefined();
    expect(result.current.metrics.isPaused).toBe(true);
  });

  it('should calculate final metrics correctly', async () => {
    const { result } = renderHook(() => useTimerMetrics(300));
    const completionTime = new Date();

    act(() => {
      result.current.updateMetrics({
        startTime: new Date(completionTime.getTime() - 5000), // 5 seconds ago
        pausedTime: 2,
      });
    });

    let finalMetrics;
    await act(async () => {
      finalMetrics = await result.current.calculateFinalMetrics(completionTime);
    });

    expect(finalMetrics).toEqual(expect.objectContaining({
      endTime: completionTime,
      actualDuration: expect.any(Number),
      netEffectiveTime: expect.any(Number),
      efficiencyRatio: expect.any(Number),
      completionStatus: expect.any(String),
    }));
  });
});
