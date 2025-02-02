import { describe, test, expect } from '../../testUtils/testRunner';
import { useTimerControls } from '../useTimerControls';
import { createHookTester } from '../../testUtils/hookTester';

const createControlsTester = createHookTester(useTimerControls);

describe('useTimerControls', () => {
  test('initializes with correct duration', () => {
    const { result } = createControlsTester({ initialDuration: 300 });
    expect(result.timeLeft).toBe(300);
    expect(result.minutes).toBe(5);
    expect(result.isRunning).toBe(false);
  });

  test('handles start and pause correctly', () => {
    const { result } = createControlsTester({ initialDuration: 300 });
    
    result.start();
    expect(result.isRunning).toBe(true);
    
    result.pause();
    expect(result.isRunning).toBe(false);
  });

  test('adds time correctly', () => {
    const { result } = createControlsTester({ initialDuration: 300 });
    const initialTime = result.timeLeft;
    
    result.addTime(5);
    expect(result.timeLeft).toBe(initialTime + 300);
    expect(result.minutes).toBe(10);
  });

  test('decrements time correctly', () => {
    const { result } = createControlsTester({ initialDuration: 300 });
    
    result.start();
    result.decrementTime();
    expect(result.timeLeft).toBe(299);
  });
});