
import { renderHook, act } from '@testing-library/react-hooks';
import { useTagSystem } from '../useTagSystem';

describe('useTagSystem', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty tags', () => {
    const { result } = renderHook(() => useTagSystem());
    expect(result.current.tags).toEqual([]);
  });

  it('should create and manage tags', () => {
    const { result } = renderHook(() => useTagSystem());

    act(() => {
      result.current.createTag('Work', 'blue');
    });

    expect(result.current.tags).toHaveLength(1);
    expect(result.current.tags[0].name).toBe('Work');
    expect(result.current.tags[0].color).toBe('blue');
  });

  it('should prevent duplicate tags', () => {
    const { result } = renderHook(() => useTagSystem());

    act(() => {
      result.current.createTag('Work', 'blue');
      result.current.createTag('Work', 'red');
    });

    expect(result.current.tags).toHaveLength(1);
    expect(result.current.tags[0].color).toBe('blue');
  });

  it('should handle tag relationships with entities', () => {
    const { result } = renderHook(() => useTagSystem());
    const taskId = 'task-123';

    act(() => {
      result.current.addTagToEntity('Work', taskId, 'task');
    });

    const entityTags = result.current.getEntityTags(taskId, 'task');
    expect(entityTags).toHaveLength(1);
    expect(entityTags[0].name).toBe('Work');
  });
});
