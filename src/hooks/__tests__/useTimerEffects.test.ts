
import { renderHook } from '@testing-library/react-hooks';
import { useTimerEffects } from '../timer/useTimerEffects';

describe('useTimerEffects', () => {
  const mockReset = vi.fn();
  const mockTimeLeft = 300; // 5 minutes
  const mockIsRunning = false;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call reset when time is up', () => {
    renderHook(() => useTimerEffects({ 
      timeLeft: 0,
      isRunning: true,
      onReset: mockReset 
    }));

    expect(mockReset).toHaveBeenCalled();
  });

  it('should not call reset when timer is running with time left', () => {
    renderHook(() => useTimerEffects({ 
      timeLeft: mockTimeLeft,
      isRunning: mockIsRunning,
      onReset: mockReset 
    }));

    expect(mockReset).not.toHaveBeenCalled();
  });

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => useTimerEffects({ 
      timeLeft: mockTimeLeft,
      isRunning: mockIsRunning,
      onReset: mockReset 
    }));

    unmount();
    expect(mockReset).not.toHaveBeenCalled();
  });
});
