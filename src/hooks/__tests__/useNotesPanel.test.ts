
import { renderHook, act } from '@testing-library/react-hooks';
import { useNotesPanel } from '../useNotesPanel';

describe('useNotesPanel', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useNotesPanel());
    
    expect(result.current.isOpen).toBe(false);
    expect(result.current.activeNoteId).toBeNull();
  });

  it('should toggle panel state', () => {
    const { result } = renderHook(() => useNotesPanel());
    
    act(() => {
      result.current.togglePanel();
    });
    
    expect(result.current.isOpen).toBe(true);
    
    act(() => {
      result.current.togglePanel();
    });
    
    expect(result.current.isOpen).toBe(false);
  });

  it('should set active note ID', () => {
    const { result } = renderHook(() => useNotesPanel());
    const testId = 'test-note-123';
    
    act(() => {
      result.current.setActiveNoteId(testId);
    });
    
    expect(result.current.activeNoteId).toBe(testId);
  });

  it('should open panel when setting active note', () => {
    const { result } = renderHook(() => useNotesPanel());
    const testId = 'test-note-456';
    
    act(() => {
      result.current.setActiveNoteId(testId);
    });
    
    expect(result.current.isOpen).toBe(true);
    expect(result.current.activeNoteId).toBe(testId);
  });

  it('should clear active note when closing panel', () => {
    const { result } = renderHook(() => useNotesPanel());
    const testId = 'test-note-789';
    
    act(() => {
      result.current.setActiveNoteId(testId);
    });
    
    expect(result.current.isOpen).toBe(true);
    expect(result.current.activeNoteId).toBe(testId);
    
    act(() => {
      result.current.closePanel();
    });
    
    expect(result.current.isOpen).toBe(false);
    expect(result.current.activeNoteId).toBeNull();
  });
});
