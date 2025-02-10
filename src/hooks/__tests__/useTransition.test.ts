
import { renderHook } from '@testing-library/react-hooks';
import { useTransition } from '../useTransition';
import { act } from 'react-dom/test-utils';

describe('useTransition', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should handle transitions correctly with default options', () => {
    const { result } = renderHook(() => useTransition({ isVisible: true }));

    expect(result.current.state).toBe('entered');
    expect(result.current.isRendered).toBe(true);

    act(() => {
      result.current.updateVisibility(false);
    });

    expect(result.current.state).toBe('exiting');

    act(() => {
      jest.advanceTimersByTime(300); // Default transition duration
    });

    expect(result.current.state).toBe('exited');
    expect(result.current.isRendered).toBe(false);
  });

  it('should handle custom duration', () => {
    const { result } = renderHook(() => useTransition({ 
      isVisible: true, 
      options: { duration: 500 }
    }));

    expect(result.current.state).toBe('entered');

    act(() => {
      result.current.updateVisibility(false);
    });

    expect(result.current.state).toBe('exiting');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.state).toBe('exited');
  });

  it('should handle delay correctly', () => {
    const { result } = renderHook(() => useTransition({ 
      isVisible: true, 
      options: { delay: 200 }
    }));

    act(() => {
      result.current.updateVisibility(false);
    });

    expect(result.current.state).toBe('entered'); // Still entered due to delay

    act(() => {
      jest.advanceTimersByTime(200); // Advance by delay time
    });

    expect(result.current.state).toBe('exiting');
  });

  it('should call callbacks correctly', () => {
    const onEnter = jest.fn();
    const onExit = jest.fn();

    const { result } = renderHook(() => useTransition({ 
      isVisible: true, 
      options: { onEnter, onExit }
    }));

    act(() => {
      result.current.updateVisibility(false);
    });

    expect(onExit).toHaveBeenCalled();

    act(() => {
      result.current.updateVisibility(true);
    });

    expect(onEnter).toHaveBeenCalled();
  });

  it('should cleanup timeouts on unmount', () => {
    const { result, unmount } = renderHook(() => useTransition({ isVisible: true }));

    act(() => {
      result.current.updateVisibility(false);
    });

    unmount();

    // Advancing timers shouldn't cause any issues after unmount
    act(() => {
      jest.advanceTimersByTime(1000);
    });
  });
});
