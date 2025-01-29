import { describe, test, expect } from '../../testUtils/testRunner';
import { TimerCircle } from '../TimerCircle';

// Test utilities
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

describe('TimerCircle Utils', () => {
  test('formats time correctly for whole minutes', () => {
    expect(formatTime(300)).toBe('05:00');
  });

  test('formats time correctly with seconds', () => {
    expect(formatTime(65)).toBe('01:05');
  });

  test('formats time correctly for max value', () => {
    expect(formatTime(3599)).toBe('59:59');
  });
});

describe('TimerCircle Component', () => {
  const defaultProps = {
    size: 'normal' as const,
    isRunning: false,
    timeLeft: 300,
    minutes: 5,
    circumference: 2 * Math.PI * 45,
  };

  test('renders with correct time format', () => {
    const result = TimerCircle(defaultProps);
    const timeString = formatTime(defaultProps.timeLeft);
    
    // Basic structure checks since we can't actually render without testing library
    expect(result).toBeTruthy();
    expect(JSON.stringify(result)).toContain(timeString);
  });

  test('uses correct size classes', () => {
    const normalResult = TimerCircle(defaultProps);
    const largeResult = TimerCircle({ ...defaultProps, size: 'large' });

    // Check class presence in rendered output
    expect(JSON.stringify(normalResult)).toContain('w-48');
    expect(JSON.stringify(largeResult)).toContain('w-96');
  });

  test('applies running styles when active', () => {
    const runningResult = TimerCircle({ ...defaultProps, isRunning: true });
    
    // Check active class presence
    expect(JSON.stringify(runningResult)).toContain('active');
  });

  test('calculates progress correctly', () => {
    const halfwayProps = {
      ...defaultProps,
      timeLeft: 150, // Half of total time
    };

    const result = TimerCircle(halfwayProps);
    const expectedOffset = defaultProps.circumference * 0.5;
    
    // Check if offset is present in rendered output
    expect(JSON.stringify(result)).toContain(expectedOffset.toString());
  });
});

// Export test utilities for reuse in other tests
export const testUtils = {
  formatTime,
};