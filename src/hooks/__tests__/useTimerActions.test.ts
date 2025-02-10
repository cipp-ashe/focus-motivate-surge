
import { renderHook } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useTimerActions } from '../timer/useTimerActions';

describe('useTimerActions', () => {
  const mockUpdateTimeLeft = vi.fn();
  const mockUpdateMinutes = vi.fn();
  const mockUpdateIsRunning = vi.fn();
  const mockUpdateMetrics = vi.fn();
  const mockOnDurationChange = vi.fn();

  const mockProps = {
    timeLeft: 300,
    minutes: 5,
    updateTimeLeft: mockUpdateTimeLeft,
    updateMinutes: mockUpdateMinutes,
    updateIsRunning: mockUpdateIsRunning,
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
    expect(mockUpdateMetrics).toHaveBeenCalledWith(expect.objectContaining({
      expectedTime: 600
    }));
    expect(mockOnDurationChange).toHaveBeenCalledWith(10);
  });

  it('should handle start action', () => {
    const { result } = renderHook(() => useTimerActions(mockProps));
    
    result.current.start();
    
    expect(mockUpdateIsRunning).toHaveBeenCalledWith(true);
    expect(mockUpdateMetrics).toHaveBeenCalledWith(expect.objectContaining({
      startTime: expect.any(Date),
      isPaused: false,
    }));
  });

  it('should handle pause action', () => {
    const { result } = renderHook(() => useTimerActions(mockProps));
    
    result.current.pause();
    
    expect(mockUpdateIsRunning).toHaveBeenCalledWith(false);
    expect(mockUpdateMetrics).toHaveBeenCalledWith(expect.objectContaining({
      isPaused: true,
      lastPauseTimestamp: expect.any(Date),
    }));
  });

  it('should handle reset action', () => {
    const { result } = renderHook(() => useTimerActions(mockProps));
    
    result.current.reset();
    
    expect(mockUpdateIsRunning).toHaveBeenCalledWith(false);
    expect(mockUpdateTimeLeft).toHaveBeenCalledWith(300);
    expect(mockUpdateMetrics).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should handle addTime action', () => {
    const { result } = renderHook(() => useTimerActions(mockProps));
    
    result.current.addTime(5);
    
    expect(mockUpdateTimeLeft).toHaveBeenCalledWith(600);
    expect(mockUpdateMinutes).toHaveBeenCalledWith(10);
    expect(mockUpdateMetrics).toHaveBeenCalledWith(expect.objectContaining({
      extensionTime: 300,
      expectedTime: 600,
    }));
  });
});
