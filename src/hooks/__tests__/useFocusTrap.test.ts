import { renderHook } from '@testing-library/react-hooks';
import { useFocusTrap } from '../useFocusTrap';

describe('useFocusTrap', () => {
  const setup = (enabled = true) => {
    return renderHook(() => useFocusTrap({ enabled }));
  };

  it('initializes with correct state', () => {
    const { result } = setup();
    expect(result.current.containerRef).toBeDefined();
    expect(typeof result.current.getFocusableElements).toBe('function');
  });

  it('handles focus trap when enabled', () => {
    const { result } = setup();
    const mockElement = {
      tabIndex: 0,
      hasAttribute: () => false,
      focus: jest.fn(),
      getAttribute: () => '0',
    };

    // Mock container with focusable elements
    Object.defineProperty(result.current.containerRef, 'current', {
      value: {
        querySelectorAll: () => [mockElement],
      },
    });

    const focusableElements = result.current.getFocusableElements();
    expect(focusableElements).toHaveLength(1);
  });

  it('respects disabled state', () => {
    const { result } = setup(false);
    expect(result.current.getFocusableElements()).toHaveLength(0);
  });

  it('excludes non-focusable elements', () => {
    const { result } = setup();
    const mockElements = [
      {
        tabIndex: 0,
        hasAttribute: (attr: string) => attr === 'disabled',
        focus: jest.fn(),
        getAttribute: () => '0',
      },
      {
        tabIndex: 0,
        hasAttribute: () => false,
        focus: jest.fn(),
        getAttribute: () => '0',
      },
    ];

    Object.defineProperty(result.current.containerRef, 'current', {
      value: {
        querySelectorAll: () => mockElements,
      },
    });

    const focusableElements = result.current.getFocusableElements();
    expect(focusableElements).toHaveLength(1);
  });
});