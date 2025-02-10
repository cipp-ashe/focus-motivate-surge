
# Writing Tests

## Hook Testing Example

```typescript
import { createHookTester } from '../testUtils/hookTester';
import { useTimer } from '../hooks/timer/useTimer';

describe('useTimer', () => {
  const createTimer = createHookTester(useTimer);

  test('initializes with correct duration', () => {
    const { result } = createTimer({ initialDuration: 300 });
    expect(result.timeLeft).toBe(300);
    expect(result.minutes).toBe(5);
    expect(result.isRunning).toBeFalsy();
  });

  test('handles time updates', () => {
    const { result } = createTimer({ initialDuration: 300 });
    result.start();
    expect(result.isRunning).toBeTruthy();
    result.pause();
    expect(result.isRunning).toBeFalsy();
  });
});
```

## Component Testing Example

```typescript
import { describe, test, expect } from '../../testUtils/testRunner';
import { TimerCircle } from '../TimerCircle';

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
    expect(result).toBeTruthy();
    expect(JSON.stringify(result)).toContain(timeString);
  });
});
```
