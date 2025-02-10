
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

  it('should handle transitions correctly', () => {
    const { result } = renderHook(() => useTransition());

    act(() => {
      result.current.startTransition();
    });

    expect(result.current.isTransitioning).toBe(true);

    act(() => {
      jest.advanceTimersByTime(300); // Default transition duration
    });

    expect(result.current.isTransitioning).toBe(false);
  });

  it('should handle custom duration', () => {
    const { result } = renderHook(() => useTransition(500));

    act(() => {
      result.current.startTransition();
    });

    expect(result.current.isTransitioning).toBe(true);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.isTransitioning).toBe(false);
  });
});
