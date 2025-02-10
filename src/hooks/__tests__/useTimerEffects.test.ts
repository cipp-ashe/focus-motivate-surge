
import { renderHook } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useTimerEffects } from '../timer/useTimerEffects';

describe('useTimerEffects', () => {
  const mockResetStates = vi.fn();
  const mockTimeLeft = 300; // 5 minutes
  const mockIsRunning = false;
  const mockTaskName = 'Test Task';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call resetStates when task changes and timer is not running', () => {
    renderHook(() => useTimerEffects({ 
      timeLeft: mockTimeLeft,
      isRunning: false,
      taskName: mockTaskName,
      resetStates: mockResetStates 
    }));

    expect(mockResetStates).toHaveBeenCalled();
  });

  it('should not call resetStates when timer is running', () => {
    renderHook(() => useTimerEffects({ 
      timeLeft: mockTimeLeft,
      isRunning: true,
      taskName: mockTaskName,
      resetStates: mockResetStates 
    }));

    expect(mockResetStates).not.toHaveBeenCalled();
  });

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => useTimerEffects({ 
      timeLeft: mockTimeLeft,
      isRunning: mockIsRunning,
      taskName: mockTaskName,
      resetStates: mockResetStates 
    }));

    unmount();
    expect(mockResetStates).toHaveBeenCalled();
  });
});
