
import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useLocalStorageData } from '../useLocalStorageData';
import { toast } from 'sonner';
import { Task } from '@/types/tasks';
import type { Quote } from '@/types/timer';
import type { HabitTemplate } from '@/components/habits/types';

vi.mock('sonner', () => ({
  toast: {
    warning: vi.fn(),
    error: vi.fn()
  }
}));

describe('useLocalStorageData', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLocalStorageData());
    expect(result.current.tasks).toEqual([]);
    expect(result.current.completedTasks).toEqual([]);
    expect(result.current.favorites).toEqual([]);
  });

  it('should handle storage updates', () => {
    const { result } = renderHook(() => useLocalStorageData());
    const mockTasks: Task[] = [{
      id: '1',
      name: 'Test Task',
      completed: false,
      createdAt: new Date().toISOString()
    }];

    act(() => {
      result.current.handleTasksUpdate(mockTasks);
    });

    expect(JSON.parse(localStorage.getItem('taskList') || '[]')).toEqual(mockTasks);
  });

  it('should handle completed tasks updates', () => {
    const { result } = renderHook(() => useLocalStorageData());
    const mockCompletedTasks: Task[] = [{
      id: '1',
      name: 'Completed Task',
      completed: true,
      createdAt: new Date().toISOString()
    }];

    act(() => {
      result.current.handleCompletedTasksUpdate(mockCompletedTasks);
    });

    expect(JSON.parse(localStorage.getItem('completedTasks') || '[]')).toEqual(mockCompletedTasks);
  });

  it('should handle favorites updates', () => {
    const { result } = renderHook(() => useLocalStorageData());
    const mockFavorites: Quote[] = [{
      text: 'Test Quote',
      author: 'Test Author',
      categories: ['motivation'],
      timestamp: new Date().toISOString()
    }];

    act(() => {
      result.current.handleFavoritesUpdate(mockFavorites);
    });

    expect(JSON.parse(localStorage.getItem('favoriteQuotes') || '[]')).toEqual(mockFavorites);
  });

  it('should handle active templates updates', () => {
    const { result } = renderHook(() => useLocalStorageData());
    const mockTemplates: HabitTemplate[] = [{
      id: '1',
      name: 'Test Template',
      description: 'Test Description',
      category: 'Test',
      defaultHabits: [],
      defaultDays: ['Monday', 'Wednesday', 'Friday'],
      duration: null,
    }];

    act(() => {
      result.current.setActiveTemplates(mockTemplates);
    });

    expect(JSON.parse(localStorage.getItem('habit-templates') || '[]')).toEqual(mockTemplates);
  });
});
