
import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useDataInitialization } from '../useDataInitialization';

describe('useDataInitialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useDataInitialization());
    expect(result.current.isInitialized).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should initialize data when required keys are missing', () => {
    const { result } = renderHook(() => useDataInitialization());
    
    expect(localStorage.getItem('schema-version')).not.toBeNull();
    expect(localStorage.getItem('entity-relations')).not.toBeNull();
    expect(localStorage.getItem('tag-relations')).not.toBeNull();
    expect(result.current.isInitialized).toBe(true);
  });

  it('should handle clearStorage', () => {
    const { result } = renderHook(() => useDataInitialization());

    act(() => {
      result.current.clearStorage();
    });

    expect(localStorage.getItem('schema-version')).toBeNull();
    expect(localStorage.getItem('entity-relations')).toBeNull();
    expect(localStorage.getItem('tag-relations')).toBeNull();
  });

  it('should show clear button when there is an error', () => {
    localStorage.setItem('schema-version', 'invalid-json');
    
    const { result } = renderHook(() => useDataInitialization());
    
    expect(result.current.showClearButton).toBe(true);
    expect(result.current.error).not.toBeNull();
  });
});
