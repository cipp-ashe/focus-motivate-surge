
import { renderHook, act } from '@testing-library/react-hooks';
import { useHabitProgress } from '../useHabitProgress';

describe('useHabitProgress', () => {
  beforeEach(() => {
    // Clear any mocked dates
    vi.useFakeTimers();
    const today = new Date('2024-02-20');
    vi.setSystemTime(today);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with empty progress', () => {
    const { result } = renderHook(() => useHabitProgress());
    const progress = result.current.getTodayProgress('habit1', 'template1');
    
    expect(progress).toEqual({
      value: false,
      streak: 0,
      date: '2024-02-20',
      completed: false,
    });
  });

  it('should update progress correctly', () => {
    const { result } = renderHook(() => useHabitProgress());
    
    act(() => {
      result.current.updateProgress('habit1', 'template1', true);
    });

    const progress = result.current.getTodayProgress('habit1', 'template1');
    expect(progress.completed).toBe(true);
    expect(progress.streak).toBe(1);
  });

  it('should get weekly progress', () => {
    const { result } = renderHook(() => useHabitProgress());
    
    act(() => {
      result.current.updateProgress('habit1', 'template1', true);
    });

    const weeklyProgress = result.current.getWeeklyProgress('habit1', 'template1');
    expect(weeklyProgress).toHaveLength(7);
    expect(weeklyProgress[6].completed).toBe(true); // Today's progress
  });

  it('should handle streak counting', () => {
    const { result } = renderHook(() => useHabitProgress());
    
    act(() => {
      result.current.updateProgress('habit1', 'template1', true);
      result.current.updateProgress('habit1', 'template1', false);
    });

    const progress = result.current.getTodayProgress('habit1', 'template1');
    expect(progress.streak).toBe(0);
  });
});
