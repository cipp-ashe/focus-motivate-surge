
import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useErrorBoundary } from '../useErrorBoundary';

describe('useErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should initialize with null error', () => {
    const { result } = renderHook(() => useErrorBoundary('TestComponent'));
    expect(result.current.error).toBe(null);
  });

  it('should handle error events', () => {
    const { result } = renderHook(() => useErrorBoundary('TestComponent'));
    
    act(() => {
      window.dispatchEvent(new ErrorEvent('error', {
        error: new Error('Test error'),
        message: 'Test error'
      }));
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toBe('Test error');
  });

  it('should handle unhandled promise rejections', () => {
    const { result } = renderHook(() => useErrorBoundary('TestComponent'));
    
    act(() => {
      window.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', {
        promise: Promise.reject(new Error('Promise error')),
        reason: new Error('Promise error')
      }));
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toBe('Promise error');
  });

  it('should clear error when requested', () => {
    const { result } = renderHook(() => useErrorBoundary('TestComponent'));
    
    act(() => {
      window.dispatchEvent(new ErrorEvent('error', {
        error: new Error('Test error'),
        message: 'Test error'
      }));
    });

    expect(result.current.error).toBeTruthy();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });

  it('should cleanup event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useErrorBoundary('TestComponent'));
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
  });
});
