import { describe, test, expect } from '../../testUtils/testRunner';
import { useTimer } from '../useTimer';
import { createHookTester } from '../../testUtils/hookTester';

// Create typed hook tester
const createTimerTester = createHookTester(useTimer);

describe('useTimer', () => {
  test('initializes with correct duration', () => {
    const { result } = createTimerTester({ initialDuration: 300 });
    expect(result.timeLeft).toBe(300);
    expect(result.minutes).toBe(5);
    expect(result.isRunning).toBeFalsy();
  });

  test('handles time updates correctly', () => {
    const { result } = createTimerTester({ initialDuration: 300 });
    
    // Start timer
    result.start();
    expect(result.isRunning).toBeTruthy();
    
    // Pause timer
    result.pause();
    expect(result.isRunning).toBeFalsy();
  });

  test('adds time correctly', () => {
    const { result } = createTimerTester({ initialDuration: 300 });
    const initialTime = result.timeLeft;
    
    result.addTime(5); // Add 5 minutes
    expect(result.timeLeft).toBe(initialTime + 300); // 5 minutes = 300 seconds
  });

  test('updates minutes and resets timeLeft', () => {
    const { result } = createTimerTester({ initialDuration: 300 });
    
    result.setMinutes(10);
    expect(result.minutes).toBe(10);
    expect(result.timeLeft).toBe(600); // 10 minutes = 600 seconds
  });

  test('calls onTimeUp when timer completes', () => {
    let timeUpCalled = false;
    const { result, advanceTime } = createTimerTester({
      initialDuration: 2,
      onTimeUp: () => { timeUpCalled = true; }
    });

    result.start();
    advanceTime(2000); // Advance 2 seconds
    expect(timeUpCalled).toBeTruthy();
  });

  test('notifies of duration changes', () => {
    let lastDuration = 0;
    const { result } = createTimerTester({
      initialDuration: 300,
      onDurationChange: (minutes) => { lastDuration = minutes; }
    });

    result.setMinutes(10);
    expect(lastDuration).toBe(10);
  });

  test('maintains state during pause/resume', () => {
    const { result } = createTimerTester({ initialDuration: 300 });
    
    result.start();
    expect(result.isRunning).toBeTruthy();
    
    result.pause();
    expect(result.isRunning).toBeFalsy();
    const pausedTime = result.timeLeft;
    
    result.start();
    expect(result.isRunning).toBeTruthy();
    expect(result.timeLeft).toBe(pausedTime);
  });

  test('respects minimum and maximum minutes', () => {
    const { result } = createTimerTester({ initialDuration: 300 });
    
    result.setMinutes(0); // Should clamp to minimum
    expect(result.minutes).toBeGreaterThanOrEqual(1);
    
    result.setMinutes(100); // Should clamp to maximum
    expect(result.minutes).toBeLessThanOrEqual(60);
  });

  test('updates time correctly', () => {
    const { result } = createTimerTester({ initialDuration: 300 });
    
    result.start();
    expect(result.timeLeft).toBeLessThanOrEqual(300);
    expect(result.timeLeft).toBeGreaterThanOrEqual(0);
  });

  test('handles cleanup on timer stop', () => {
    const { result, rerender } = createTimerTester({ initialDuration: 300 });
    
    result.start();
    expect(result.isRunning).toBeTruthy();
    
    // Simulate component unmount
    rerender();
    expect(result.isRunning).toBeFalsy();
  });

  test('validates duration input', () => {
    const { result } = createTimerTester({ initialDuration: -100 });
    expect(result.timeLeft).toBeGreaterThan(0);
    expect(result.minutes).toBeGreaterThan(0);
  });
});