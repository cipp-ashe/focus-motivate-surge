
import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useHabitProgress } from '@/components/habits/hooks/useHabitProgress';

describe('useHabitProgress', () => {
  // Mock localStorage
  let localStorageMock = {};
  
  beforeEach(() => {
    vi.useFakeTimers();
    const today = new Date('2024-02-20');
    vi.setSystemTime(today);
    
    // Setup localStorage mock
    localStorageMock = {};
    Storage.prototype.getItem = vi.fn((key) => {
      return localStorageMock[key] || null;
    });
    Storage.prototype.setItem = vi.fn((key, value) => {
      localStorageMock[key] = value;
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
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
    
    // Verify localStorage was updated
    expect(localStorage.setItem).toHaveBeenCalled();
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
  
  it('should load saved progress from localStorage', () => {
    // Setup mock data in localStorage
    const mockData = {
      template1: {
        habit1: {
          '2024-02-20': {
            value: true,
            streak: 3,
            date: '2024-02-20',
            completed: true
          }
        }
      }
    };
    
    // Manually set the mock return value for this specific test
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => JSON.stringify(mockData));
    
    const { result } = renderHook(() => useHabitProgress());
    
    const progress = result.current.getTodayProgress('habit1', 'template1');
    expect(progress.completed).toBe(true);
    expect(progress.streak).toBe(3);
  });
});
