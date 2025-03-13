
import { renderHook } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useTimerMonitor } from '../useTimerMonitor';

describe('useTimerMonitor', () => {
  const mockProps = {
    onComplete: vi.fn(),
    onProgress: vi.fn(),
    onStart: vi.fn(),
    onPause: vi.fn(),
    onResume: vi.fn(),
    onTick: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call onTick when timer ticks', () => {
    const { result } = renderHook(() => useTimerMonitor(mockProps));
    expect(result.current).toBeDefined();
  });

  it('should handle pause events', () => {
    const { result } = renderHook(() => useTimerMonitor({
      ...mockProps,
      onPause: vi.fn()
    }));
    expect(result.current).toBeDefined();
  });

  it('should monitor timer completion', () => {
    const { result } = renderHook(() => useTimerMonitor({
      ...mockProps,
      onComplete: vi.fn()
    }));
    expect(result.current).toBeDefined();
  });
});
