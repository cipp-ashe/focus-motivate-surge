
import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useLocalStorageData } from '../useLocalStorageData';
import { toast } from 'sonner';

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
    const mockTasks = [{ id: '1', name: 'Test Task', completed: false }];

    act(() => {
      result.current.handleTasksUpdate(mockTasks);
    });

    expect(JSON.parse(localStorage.getItem('taskList') || '[]')).toEqual(mockTasks);
  });

  it('should handle completed tasks updates', () => {
    const { result } = renderHook(() => useLocalStorageData());
    const mockCompletedTasks = [{ id: '1', name: 'Completed Task', completed: true }];

    act(() => {
      result.current.handleCompletedTasksUpdate(mockCompletedTasks);
    });

    expect(JSON.parse(localStorage.getItem('completedTasks') || '[]')).toEqual(mockCompletedTasks);
  });

  it('should handle favorites updates', () => {
    const { result } = renderHook(() => useLocalStorageData());
    const mockFavorites = [{ text: 'Test Quote', author: 'Test Author' }];

    act(() => {
      result.current.handleFavoritesUpdate(mockFavorites);
    });

    expect(JSON.parse(localStorage.getItem('favoriteQuotes') || '[]')).toEqual(mockFavorites);
  });

  it('should handle active templates updates', () => {
    const { result } = renderHook(() => useLocalStorageData());
    const mockTemplates = [{ templateId: '1', habits: [] }];

    act(() => {
      result.current.setActiveTemplates(mockTemplates);
    });

    expect(JSON.parse(localStorage.getItem('habit-templates') || '[]')).toEqual(mockTemplates);
  });
});
