
import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useNoteStorage } from '../useNoteStorage';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('useNoteStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should handle clearing notes', async () => {
    const { result } = renderHook(() => useNoteStorage());

    localStorage.setItem('notes', JSON.stringify([{ id: '1', content: 'test' }]));

    await act(async () => {
      await result.current.handleClearNotes();
    });

    expect(localStorage.getItem('notes')).toBeNull();
    expect(toast.success).toHaveBeenCalledWith('All notes cleared 🗑️');
  });

  it('should handle deleting a note', async () => {
    const { result } = renderHook(() => useNoteStorage());
    const mockNotes = [
      { id: '1', content: 'test1' },
      { id: '2', content: 'test2' }
    ];

    localStorage.setItem('notes', JSON.stringify(mockNotes));

    await act(async () => {
      await result.current.handleDeleteNote('1');
    });

    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    expect(savedNotes).toHaveLength(1);
    expect(savedNotes[0].id).toBe('2');
    expect(toast.success).toHaveBeenCalledWith('Note deleted 🗑️');
  });

  it('should handle adding a tag', async () => {
    const { result } = renderHook(() => useNoteStorage());
    const mockNotes = [
      { id: '1', content: 'test1', tags: [] }
    ];

    localStorage.setItem('notes', JSON.stringify(mockNotes));

    await act(async () => {
      await result.current.handleAddTag('1', 'test-tag');
    });

    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    expect(savedNotes[0].tags).toHaveLength(1);
    expect(savedNotes[0].tags[0].name).toBe('test-tag');
    expect(toast.success).toHaveBeenCalledWith('Tag added ✨');
  });

  it('should handle removing a tag', async () => {
    const { result } = renderHook(() => useNoteStorage());
    const mockNotes = [
      { 
        id: '1', 
        content: 'test1', 
        tags: [{ name: 'test-tag', color: 'default' }] 
      }
    ];

    localStorage.setItem('notes', JSON.stringify(mockNotes));

    await act(async () => {
      await result.current.handleRemoveTag('1', 'test-tag');
    });

    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    expect(savedNotes[0].tags).toHaveLength(0);
    expect(toast.success).toHaveBeenCalledWith('Tag removed 🗑️');
  });

  it('should handle errors gracefully', async () => {
    const { result } = renderHook(() => useNoteStorage());

    // Simulate localStorage error
    const mockError = new Error('Storage error');
    vi.spyOn(localStorage, 'getItem').mockImplementation(() => { throw mockError; });

    await act(async () => {
      await result.current.handleDeleteNote('1');
    });

    expect(toast.error).toHaveBeenCalled();
    expect(result.current.error).toBeTruthy();
  });
});
