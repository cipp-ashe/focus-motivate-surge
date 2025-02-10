
import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useNotes } from '../useNotes';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('useNotes', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with empty notes', () => {
    const { result } = renderHook(() => useNotes());
    expect(result.current.notes).toEqual([]);
    expect(result.current.selectedNote).toBeNull();
    expect(result.current.currentContent).toBe('');
  });

  it('should add a new note', () => {
    const { result } = renderHook(() => useNotes());
    
    act(() => {
      result.current.updateCurrentContent('Test Note');
      result.current.addNote();
    });

    expect(result.current.notes).toHaveLength(1);
    expect(result.current.notes[0].content).toBe('Test Note');
    expect(result.current.currentContent).toBe('');
  });

  it('should delete a note', () => {
    const { result } = renderHook(() => useNotes());
    
    act(() => {
      result.current.updateCurrentContent('Test Note');
      const note = result.current.addNote();
      if (note) {
        result.current.deleteNote(note.id);
      }
    });

    expect(result.current.notes).toHaveLength(0);
  });

  it('should update a note', () => {
    const { result } = renderHook(() => useNotes());
    
    act(() => {
      result.current.updateCurrentContent('Test Note');
      const note = result.current.addNote();
      if (note) {
        result.current.updateNote(note.id, 'Updated Note');
      }
    });

    expect(result.current.notes[0].content).toBe('Updated Note');
  });

  it('should add and remove tags from a note', () => {
    const { result } = renderHook(() => useNotes());
    
    act(() => {
      result.current.updateCurrentContent('Test Note');
      const note = result.current.addNote();
      if (note) {
        result.current.addTagToNote(note.id, 'test-tag');
      }
    });

    expect(result.current.notes[0].tags).toHaveLength(1);
    expect(result.current.notes[0].tags[0].name).toBe('test-tag');

    act(() => {
      result.current.removeTagFromNote(result.current.notes[0].id, 'test-tag');
    });

    expect(result.current.notes[0].tags).toHaveLength(0);
  });

  it('should select and clear selected note', () => {
    const { result } = renderHook(() => useNotes());
    
    act(() => {
      result.current.updateCurrentContent('Test Note');
      const note = result.current.addNote();
      if (note) {
        result.current.selectNoteForEdit(note);
      }
    });

    expect(result.current.selectedNote).not.toBeNull();
    expect(result.current.currentContent).toBe('Test Note');

    act(() => {
      result.current.clearSelectedNote();
    });

    expect(result.current.selectedNote).toBeNull();
    expect(result.current.currentContent).toBe('');
  });
});
