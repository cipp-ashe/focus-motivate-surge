import { describe, test, expect } from '../../testUtils/testRunner';
import { useTimerMetrics } from '../useTimerMetrics';
import { createHookTester } from '../../testUtils/hookTester';

const createMetricsTester = createHookTester(useTimerMetrics);

describe('useTimerMetrics', () => {
  test('initializes with correct values', () => {
    const { result } = createMetricsTester(300);
    expect(result.metrics.originalDuration).toBe(300);
    expect(result.metrics.pauseCount).toBe(0);
    expect(result.metrics.isPaused).toBe(false);
  });

  test('calculates final metrics correctly', async () => {
    const { result } = createMetricsTester(60);
    
    // Set initial state
    result.updateMetrics({
      startTime: new Date(Date.now() - 70000), // 70 seconds ago
      pausedTime: 10, // 10 seconds paused
    });

    const finalMetrics = await result.calculateFinalMetrics(new Date());
    
    expect(finalMetrics.actualDuration).toBe(70);
    expect(finalMetrics.pausedTime).toBe(10);
    expect(finalMetrics.netEffectiveTime).toBe(60);
    expect(finalMetrics.completionStatus).toBe('Completed On Time');
  });
});