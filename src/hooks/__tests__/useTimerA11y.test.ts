
import { renderHook } from '@testing-library/react-hooks';
import { vi, describe, it, expect } from 'vitest';
import { useTimerA11y } from '../timer/useTimerA11y';

describe('useTimerA11y', () => {
  const mockProps = {
    isRunning: false,
    timeLeft: 300,
    taskName: 'Test Task',
    isExpanded: false,
  };

  it('should return correct accessibility props for timer', () => {
    const { result } = renderHook(() => useTimerA11y(mockProps));
    
    const timerProps = result.current.getTimerA11yProps();
    expect(timerProps.role).toBe('timer');
    expect(timerProps['aria-label']).toBe('Timer for Test Task');
    expect(timerProps['aria-valuemax']).toBe(300);
  });

  it('should return correct accessibility props for toggle button', () => {
    const { result } = renderHook(() => useTimerA11y(mockProps));
    
    const toggleProps = result.current.getToggleButtonA11yProps();
    expect(toggleProps['aria-label']).toBe('Start timer for Test Task');
    expect(toggleProps['aria-pressed']).toBe(false);
  });

  it('should return correct props when timer is running', () => {
    const { result } = renderHook(() => useTimerA11y({
      ...mockProps,
      isRunning: true
    }));
    
    const toggleProps = result.current.getToggleButtonA11yProps();
    expect(toggleProps['aria-label']).toBe('Pause timer for Test Task');
    expect(toggleProps['aria-pressed']).toBe(true);
  });

  it('should format time correctly for announcements', () => {
    const { result } = renderHook(() => useTimerA11y(mockProps));
    
    expect(result.current.formatTimeForA11y(65)).toBe('1 minute and 5 seconds');
    expect(result.current.formatTimeForA11y(60)).toBe('1 minute');
    expect(result.current.formatTimeForA11y(120)).toBe('2 minutes');
  });
});
