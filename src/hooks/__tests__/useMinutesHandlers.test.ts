
import { renderHook } from '@testing-library/react-hooks';
import { describe, it, expect, vi } from 'vitest';
import { useMinutesHandlers } from '../useMinutesHandlers';

describe('useMinutesHandlers', () => {
  const mockOnMinutesChange = vi.fn();
  const mockOnBlur = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle increment correctly', () => {
    const { result } = renderHook(() => useMinutesHandlers({
      minutes: 3,
      onMinutesChange: mockOnMinutesChange,
      minMinutes: 1,
      maxMinutes: 10,
      onBlur: mockOnBlur
    }));

    result.current.handleIncrement({} as React.MouseEvent);
    expect(mockOnMinutesChange).toHaveBeenCalledWith(4);
  });

  it('should handle increment with step of 5 for values >= 5', () => {
    const { result } = renderHook(() => useMinutesHandlers({
      minutes: 7,
      onMinutesChange: mockOnMinutesChange,
      minMinutes: 1,
      maxMinutes: 20,
      onBlur: mockOnBlur
    }));

    result.current.handleIncrement({} as React.MouseEvent);
    expect(mockOnMinutesChange).toHaveBeenCalledWith(12);
  });

  it('should handle decrement correctly', () => {
    const { result } = renderHook(() => useMinutesHandlers({
      minutes: 3,
      onMinutesChange: mockOnMinutesChange,
      minMinutes: 1,
      maxMinutes: 10,
      onBlur: mockOnBlur
    }));

    result.current.handleDecrement({} as React.MouseEvent);
    expect(mockOnMinutesChange).toHaveBeenCalledWith(2);
  });

  it('should handle input change correctly', () => {
    const { result } = renderHook(() => useMinutesHandlers({
      minutes: 5,
      onMinutesChange: mockOnMinutesChange,
      minMinutes: 1,
      maxMinutes: 10,
      onBlur: mockOnBlur
    }));

    result.current.handleInputChange({ target: { value: '7' } } as React.ChangeEvent<HTMLInputElement>);
    expect(mockOnMinutesChange).toHaveBeenCalledWith(7);
  });

  it('should handle empty input correctly', () => {
    const { result } = renderHook(() => useMinutesHandlers({
      minutes: 5,
      onMinutesChange: mockOnMinutesChange,
      minMinutes: 1,
      maxMinutes: 10,
      onBlur: mockOnBlur
    }));

    result.current.handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    expect(mockOnMinutesChange).toHaveBeenCalledWith(1);
  });

  it('should handle blur correctly', () => {
    const { result } = renderHook(() => useMinutesHandlers({
      minutes: 15,
      onMinutesChange: mockOnMinutesChange,
      minMinutes: 1,
      maxMinutes: 10,
      onBlur: mockOnBlur
    }));

    result.current.handleBlur({} as React.FocusEvent<HTMLInputElement>);
    expect(mockOnMinutesChange).toHaveBeenCalledWith(10);
    expect(mockOnBlur).toHaveBeenCalled();
  });
});
