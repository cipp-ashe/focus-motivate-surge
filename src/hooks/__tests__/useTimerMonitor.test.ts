
import { renderHook } from '@testing-library/react-hooks';
import { useTimerMonitor } from '../useTimerMonitor';

describe('useTimerMonitor', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTimerMonitor());
    
    expect(result.current.isTimerActive).toBe(false);
    expect(result.current.activeTaskId).toBeNull();
  });

  it('should update timer state', () => {
    const { result } = renderHook(() => useTimerMonitor());
    const taskId = 'task-123';

    result.current.startTimer(taskId);
    expect(result.current.isTimerActive).toBe(true);
    expect(result.current.activeTaskId).toBe(taskId);

    result.current.stopTimer();
    expect(result.current.isTimerActive).toBe(false);
    expect(result.current.activeTaskId).toBeNull();
  });
});
