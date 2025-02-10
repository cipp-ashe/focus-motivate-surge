
import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useHabits } from '../useHabits';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('useHabits', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with empty habits array', () => {
    const { result } = renderHook(() => useHabits());
    expect(result.current.habits).toEqual([]);
  });

  it('should add a new habit', () => {
    const { result } = renderHook(() => useHabits());
    const newHabit = {
      name: 'Test Habit',
      description: 'Test Description',
      category: 'Work',
      timePreference: 'Morning'
    } as const;

    act(() => {
      result.current.addHabit(newHabit);
    });

    expect(result.current.habits).toHaveLength(1);
    expect(result.current.habits[0].name).toBe('Test Habit');
    expect(toast.success).toHaveBeenCalledWith("New habit created!");
  });

  it('should toggle habit completion', () => {
    const { result } = renderHook(() => useHabits());
    const newHabit = {
      name: 'Test Habit',
      description: 'Test Description',
      category: 'Work',
      timePreference: 'Morning'
    } as const;

    act(() => {
      result.current.addHabit(newHabit);
      result.current.toggleHabit(result.current.habits[0].id);
    });

    expect(result.current.habits[0].completed).toBe(true);
    expect(result.current.habits[0].streak).toBe(1);
    expect(toast.success).toHaveBeenCalledWith("Habit status updated!");
  });

  it('should delete a habit', () => {
    const { result } = renderHook(() => useHabits());
    const newHabit = {
      name: 'Test Habit',
      description: 'Test Description',
      category: 'Work',
      timePreference: 'Morning'
    } as const;

    act(() => {
      result.current.addHabit(newHabit);
      result.current.deleteHabit(result.current.habits[0].id);
    });

    expect(result.current.habits).toHaveLength(0);
    expect(toast.success).toHaveBeenCalledWith("Habit deleted!");
  });

  it('should update a habit', () => {
    const { result } = renderHook(() => useHabits());
    const newHabit = {
      name: 'Test Habit',
      description: 'Test Description',
      category: 'Work',
      timePreference: 'Morning'
    } as const;

    act(() => {
      result.current.addHabit(newHabit);
      result.current.updateHabit(result.current.habits[0].id, {
        name: 'Updated Habit'
      });
    });

    expect(result.current.habits[0].name).toBe('Updated Habit');
    expect(toast.success).toHaveBeenCalledWith("Habit updated!");
  });
});
