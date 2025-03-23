
import { renderHook } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useFocusTrap } from '../useFocusTrap';

describe('useFocusTrap', () => {
  const mockFocusableElement = {
    focus: vi.fn(),
    hasAttribute: () => false,
    getAttribute: () => null,
    tabIndex: 0
  } as unknown as HTMLElement;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct state', () => {
    const { result } = renderHook(() => useFocusTrap({ enabled: true }));
    expect(result.current).toBeDefined();
    expect(typeof result.current.getFocusableElements).toBe('function');
  });

  it('should handle disabled state', () => {
    const { result } = renderHook(() => useFocusTrap({ enabled: false }));
    
    Object.defineProperty(result.current, 'current', {
      value: {
        querySelectorAll: () => []
      }
    });

    const elements = result.current.getFocusableElements();
    expect(elements).toHaveLength(0);
  });

  it('should get focusable elements', () => {
    const { result } = renderHook(() => useFocusTrap({ enabled: true }));
    
    Object.defineProperty(result.current, 'current', {
      value: {
        querySelectorAll: () => [mockFocusableElement]
      }
    });

    const elements = result.current.getFocusableElements();
    expect(elements).toHaveLength(1);
  });

  it('should handle null container ref', () => {
    const { result } = renderHook(() => useFocusTrap({ enabled: true }));
    
    Object.defineProperty(result.current, 'current', {
      value: null
    });

    const elements = result.current.getFocusableElements();
    expect(elements).toHaveLength(0);
  });
});
