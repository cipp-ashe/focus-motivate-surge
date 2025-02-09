
import { renderHook, act } from '@testing-library/react-hooks';
import { useTagSystem } from '../useTagSystem';

describe('useTagSystem', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset mock event listeners
    global.mockAddEventListener.mockClear();
    global.mockRemoveEventListener.mockClear();
  });

  it('should create and manage tags', () => {
    const { result } = renderHook(() => useTagSystem());

    // Create a tag
    act(() => {
      result.current.createTag('Test Tag', 'blue');
    });

    // Verify tag was created
    expect(result.current.tags).toHaveLength(1);
    expect(result.current.tags[0].name).toBe('Test Tag');
    expect(result.current.tags[0].color).toBe('blue');
  });

  it('should handle tag relationships with entities', () => {
    const { result } = renderHook(() => useTagSystem());
    const entityId = 'test-123';

    // Add tag to entity
    act(() => {
      result.current.addTagToEntity('Test Tag', entityId, 'task');
    });

    // Get entity tags
    const entityTags = result.current.getEntityTags(entityId, 'task');
    expect(entityTags).toHaveLength(1);
    expect(entityTags[0].name).toBe('Test Tag');
  });

  it('should update tag colors', () => {
    const { result } = renderHook(() => useTagSystem());

    // Create a tag
    act(() => {
      result.current.createTag('Test Tag', 'default');
    });

    // Update tag color
    act(() => {
      result.current.updateTagColor('Test Tag', 'red');
    });

    // Verify color was updated
    const tag = result.current.tags.find(t => t.name === 'Test Tag');
    expect(tag?.color).toBe('red');
  });

  it('should handle tag removal', () => {
    const { result } = renderHook(() => useTagSystem());
    const entityId = 'test-123';

    // Add tag to entity
    act(() => {
      result.current.addTagToEntity('Test Tag', entityId, 'task');
    });

    // Remove tag from entity
    act(() => {
      result.current.removeTagFromEntity('Test Tag', entityId, 'task');
    });

    // Verify tag was removed
    const entityTags = result.current.getEntityTags(entityId, 'task');
    expect(entityTags).toHaveLength(0);
  });

  it('should prevent duplicate tags', () => {
    const { result } = renderHook(() => useTagSystem());

    // Create tag twice
    act(() => {
      result.current.createTag('Test Tag', 'blue');
      result.current.createTag('Test Tag', 'red');
    });

    // Verify only one tag exists
    expect(result.current.tags).toHaveLength(1);
    expect(result.current.tags[0].color).toBe('blue'); // Original color should remain
  });
});
