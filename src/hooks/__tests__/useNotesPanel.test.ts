
import { renderHook, act } from '@testing-library/react-hooks';
import { describe, it, expect } from 'vitest';
import { useNotesPanel } from '../useNotesPanel';

describe('useNotesPanel', () => {
  it('should initialize with isOpen as false', () => {
    const { result } = renderHook(() => useNotesPanel());
    expect(result.current.isOpen).toBe(false);
  });

  it('should toggle panel state', () => {
    const { result } = renderHook(() => useNotesPanel());
    
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should open panel', () => {
    const { result } = renderHook(() => useNotesPanel());
    
    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);
  });

  it('should close panel', () => {
    const { result } = renderHook(() => useNotesPanel());
    
    act(() => {
      result.current.open();
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
  });
});
