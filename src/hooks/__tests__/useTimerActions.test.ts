
import { renderHook } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useTimerActions } from '../timer/useTimerActions';
import { TimerStateMetrics } from '@/types/metrics';
import { TimerState } from '@/types/timer';

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

  const mockState: TimerState = {
    timeLeft: 300,
    isRunning: false,
    isPaused: false,
    showCompletion: false,
    completionCelebrated: false,
    metrics: mockMetrics
  };

  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle startTimer correctly', () => {
    const { result } = renderHook(() => useTimerActions(mockState, mockDispatch));
    
    result.current.startTimer();
    
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'START' });
    expect(mockDispatch).toHaveBeenCalledWith({ 
      type: 'SET_START_TIME', 
      payload: expect.any(Date) 
    });
  });

  it('should handle pauseTimer correctly', () => {
    const runningState = { ...mockState, isRunning: true };
    const { result } = renderHook(() => useTimerActions(runningState, mockDispatch));
    
    result.current.pauseTimer();
    
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'PAUSE' });
    expect(mockDispatch).toHaveBeenCalledWith({ 
      type: 'SET_LAST_PAUSE_TIMESTAMP', 
      payload: expect.any(Date) 
    });
  });

  it('should not pause if already paused', () => {
    const pausedState = { ...mockState, isRunning: true, isPaused: true };
    const { result } = renderHook(() => useTimerActions(pausedState, mockDispatch));
    
    result.current.pauseTimer();
    
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should handle resetTimer correctly', () => {
    const { result } = renderHook(() => useTimerActions(mockState, mockDispatch));
    
    result.current.resetTimer();
    
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESET' });
  });

  it('should handle extendTimer correctly', () => {
    const { result } = renderHook(() => useTimerActions(mockState, mockDispatch));
    
    result.current.extendTimer(5);
    
    expect(mockDispatch).toHaveBeenCalledWith({ 
      type: 'EXTEND', 
      payload: 300 
    });
    expect(mockDispatch).toHaveBeenCalledWith({ 
      type: 'SET_EXTENSION_TIME', 
      payload: 300 
    });
  });
});
