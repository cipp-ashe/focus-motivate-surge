
import { renderHook } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useTimerActions } from '../timer/useTimerActions';
import { TimerStateMetrics } from '@/types/metrics';
import { TimerActionProps } from '../timer/types/UseTimerTypes';

describe('useTimerActions', () => {
  const mockMetrics: TimerStateMetrics = {
    startTime: null,
    endTime: null,
    pauseCount: 0,
    expectedTime: 300,
    actualDuration: 0,
    favoriteQuotes: [] as string[],
    pausedTime: 0,
    lastPauseTimestamp: null,
    extensionTime: 0,
    netEffectiveTime: 0,
    efficiencyRatio: 0,
    completionStatus: 'Completed On Time',
    isPaused: false,
    pausedTimeLeft: null
  };

  const mockProps: TimerActionProps = {
    timeLeft: 300,
    metrics: mockMetrics,
    updateTimeLeft: vi.fn(),
    updateMetrics: vi.fn(),
    setIsRunning: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle startTimer correctly', () => {
    const { result } = renderHook(() => useTimerActions(mockProps));
    
    result.current.startTimer();
    
    expect(mockProps.setIsRunning).toHaveBeenCalledWith(true);
    expect(mockProps.updateMetrics).toHaveBeenCalledWith({
      startTime: expect.any(Date),
      isPaused: false
    });
  });

  it('should handle pauseTimer correctly', () => {
    const runningProps = {
      ...mockProps,
      timeLeft: 200
    };
    
    const { result } = renderHook(() => useTimerActions(runningProps));
    
    result.current.pauseTimer();
    
    expect(runningProps.setIsRunning).toHaveBeenCalledWith(false);
    expect(runningProps.updateMetrics).toHaveBeenCalledWith({
      pauseCount: 1,
      lastPauseTimestamp: expect.any(Date),
      isPaused: true,
      pausedTimeLeft: 200
    });
  });

  it('should handle resetTimer correctly', () => {
    const { result } = renderHook(() => useTimerActions(mockProps));
    
    result.current.resetTimer();
    
    expect(mockProps.setIsRunning).toHaveBeenCalledWith(false);
    expect(mockProps.updateTimeLeft).toHaveBeenCalledWith(300);
    expect(mockProps.updateMetrics).toHaveBeenCalledWith({
      startTime: null,
      endTime: null,
      pauseCount: 0,
      actualDuration: 0,
      pausedTime: 0,
      lastPauseTimestamp: null,
      extensionTime: 0,
      isPaused: false,
      pausedTimeLeft: null
    });
  });

  it('should handle extendTimer correctly', () => {
    const { result } = renderHook(() => useTimerActions(mockProps));
    
    result.current.extendTimer(5);
    
    expect(mockProps.updateTimeLeft).toHaveBeenCalledWith(600); // 300 + (5 * 60)
    expect(mockProps.updateMetrics).toHaveBeenCalledWith({
      extensionTime: 300 // 5 * 60
    });
  });

  it('should handle completeTimer correctly', () => {
    const { result } = renderHook(() => useTimerActions(mockProps));
    
    const returnedMetrics = result.current.completeTimer();
    
    expect(mockProps.setIsRunning).toHaveBeenCalledWith(false);
    expect(mockProps.updateMetrics).toHaveBeenCalledWith(expect.objectContaining({
      endTime: expect.any(Date),
      actualDuration: expect.any(Number),
      netEffectiveTime: expect.any(Number),
      efficiencyRatio: expect.any(Number),
      completionStatus: expect.any(String),
      isPaused: false
    }));
    
    expect(returnedMetrics).toEqual(expect.objectContaining({
      ...mockMetrics,
      endTime: expect.any(Date),
      actualDuration: expect.any(Number),
      netEffectiveTime: expect.any(Number),
      efficiencyRatio: expect.any(Number),
      completionStatus: expect.any(String),
      isPaused: false
    }));
  });
});
