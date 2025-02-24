
import { renderHook } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useTimerActions } from '../timer/useTimerActions';
import { TimerStateMetrics } from '@/types/metrics';

describe('useTimerActions', () => {
  const mockUpdateTimeLeft = vi.fn();
  const mockUpdateMinutes = vi.fn();
  const mockSetIsRunning = vi.fn();
  const mockUpdateMetrics = vi.fn();
  const mockOnDurationChange = vi.fn();

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

  const mockProps = {
    timeLeft: 300,
    minutes: 5,
    taskName: 'Test Task',
    metrics: mockMetrics,
    updateTimeLeft: mockUpdateTimeLeft,
    updateMinutes: mockUpdateMinutes,
    setIsRunning: mockSetIsRunning,
    updateMetrics: mockUpdateMetrics,
    onDurationChange: mockOnDurationChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle setMinutes correctly', () => {
    const { result } = renderHook(() => useTimerActions(mockProps));
    
    result.current.setMinutes(10);
    
    expect(mockUpdateMinutes).toHaveBeenCalledWith(10);
    expect(mockUpdateTimeLeft).toHaveBeenCalledWith(600);
    expect(mockUpdateMetrics).toHaveBeenCalledWith({
      expectedTime: 600
    });
    expect(mockOnDurationChange).toHaveBeenCalledWith(10);
  });

  it('should handle start action', () => {
    const { result } = renderHook(() => useTimerActions(mockProps));
    
    result.current.start();
    
    expect(mockSetIsRunning).toHaveBeenCalledWith(true);
    expect(mockUpdateMetrics).toHaveBeenCalledWith({
      startTime: expect.any(Date),
      isPaused: false,
      pausedTimeLeft: null
    });
  });

  it('should handle pause action', () => {
    const { result } = renderHook(() => useTimerActions(mockProps));
    
    result.current.pause();
    
    expect(mockSetIsRunning).toHaveBeenCalledWith(false);
    expect(mockUpdateMetrics).toHaveBeenCalledWith({
      isPaused: true,
      lastPauseTimestamp: expect.any(Date),
      pauseCount: expect.any(Number),
      pausedTimeLeft: 300
    });
  });

  it('should handle reset action', () => {
    const { result } = renderHook(() => useTimerActions(mockProps));
    
    result.current.reset();
    
    expect(mockSetIsRunning).toHaveBeenCalledWith(false);
    expect(mockUpdateTimeLeft).toHaveBeenCalledWith(300);
    expect(mockUpdateMetrics).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should handle addTime action', () => {
    const { result } = renderHook(() => useTimerActions(mockProps));
    
    result.current.addTime(5);
    
    expect(mockUpdateTimeLeft).toHaveBeenCalledWith(600);
    expect(mockUpdateMinutes).toHaveBeenCalledWith(10);
    expect(mockUpdateMetrics).toHaveBeenCalledWith({
      extensionTime: 300,
      expectedTime: 600,
    });
  });
});
