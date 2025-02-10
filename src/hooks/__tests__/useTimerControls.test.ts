
import { renderHook, act } from '@testing-library/react-hooks';
import { useTimerControls } from '../timer/useTimerControls';

describe('useTimerControls', () => {
  const mockSetTimeLeft = vi.fn();
  const mockSetIsRunning = vi.fn();
  const mockOnComplete = vi.fn();
  const initialTimeLeft = 300; // 5 minutes

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct state', () => {
    const { result } = renderHook(() => useTimerControls({
      timeLeft: initialTimeLeft,
      setTimeLeft: mockSetTimeLeft,
      setIsRunning: mockSetIsRunning,
      onComplete: mockOnComplete
    }));

    expect(result.current.handleStart).toBeDefined();
    expect(result.current.handlePause).toBeDefined();
    expect(result.current.handleComplete).toBeDefined();
  });

  it('should handle start correctly', () => {
    const { result } = renderHook(() => useTimerControls({
      timeLeft: initialTimeLeft,
      setTimeLeft: mockSetTimeLeft,
      setIsRunning: mockSetIsRunning,
      onComplete: mockOnComplete
    }));

    act(() => {
      result.current.handleStart();
    });

    expect(mockSetIsRunning).toHaveBeenCalledWith(true);
  });

  it('should handle pause correctly', () => {
    const { result } = renderHook(() => useTimerControls({
      timeLeft: initialTimeLeft,
      setTimeLeft: mockSetTimeLeft,
      setIsRunning: mockSetIsRunning,
      onComplete: mockOnComplete
    }));

    act(() => {
      result.current.handlePause();
    });

    expect(mockSetIsRunning).toHaveBeenCalledWith(false);
  });

  it('should handle complete correctly', () => {
    const { result } = renderHook(() => useTimerControls({
      timeLeft: initialTimeLeft,
      setTimeLeft: mockSetTimeLeft,
      setIsRunning: mockSetIsRunning,
      onComplete: mockOnComplete
    }));

    act(() => {
      result.current.handleComplete();
    });

    expect(mockOnComplete).toHaveBeenCalled();
    expect(mockSetIsRunning).toHaveBeenCalledWith(false);
  });
});
