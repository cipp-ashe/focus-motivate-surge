import { describe, test, expect } from '../../testUtils/testRunner';
import { useTransition } from '../useTransition';
import { createHookTester } from '../../testUtils/hookTester';

const createTransitionTester = createHookTester(useTransition);

describe('useTransition', () => {
  const defaultConfig = {
    isVisible: true,
    options: { duration: 300 }
  };

  test('initializes with correct state', () => {
    const { result } = createTransitionTester(defaultConfig);
    expect(result.state).toBe('entered');
    expect(result.isRendered).toBeTruthy();
  });

  test('handles enter transition', () => {
    let enterCalled = false;
    const { result } = createTransitionTester({
      isVisible: false,
      options: {
        duration: 300,
        onEnter: () => { enterCalled = true; }
      }
    });

    result.updateVisibility(true);
    expect(enterCalled).toBeTruthy();
  });

  test('handles exit transition', () => {
    let exitCalled = false;
    const { result } = createTransitionTester({
      isVisible: true,
      options: {
        duration: 300,
        onExit: () => { exitCalled = true; }
      }
    });

    result.updateVisibility(false);
    expect(exitCalled).toBeTruthy();
  });

  test('respects transition duration', () => {
    const { result, advanceTime } = createTransitionTester(defaultConfig);

    result.updateVisibility(false);
    expect(result.state).toBe('exiting');
    expect(result.isRendered).toBeTruthy();

    advanceTime(300);
    expect(result.state).toBe('exited');
    expect(result.isRendered).toBeFalsy();
  });

  test('handles delayed transitions', () => {
    const { result, advanceTime } = createTransitionTester({
      isVisible: true,
      options: {
        duration: 300,
        delay: 100
      }
    });

    result.updateVisibility(false);
    expect(result.state).toBe('entered');

    advanceTime(100);
    expect(result.state).toBe('exiting');

    advanceTime(300);
    expect(result.state).toBe('exited');
  });

  test('provides correct transition props', () => {
    const { result } = createTransitionTester(defaultConfig);
    const props = result.getTransitionProps();

    expect(props.style).toBeTruthy();
    expect(props.style.transition).toContain('300ms');
    expect(props.style.opacity).toBe(1);
    expect(props['aria-hidden']).toBeFalsy();
  });

  test('handles state changes correctly', () => {
    const { result } = createTransitionTester(defaultConfig);

    // Entering -> Entered
    expect(result.state).toBe('entered');
    expect(result.isRendered).toBeTruthy();

    // Entered -> Exiting
    result.updateVisibility(false);
    expect(result.state).toBe('exiting');
    expect(result.isRendered).toBeTruthy();
  });

  test('cleans up timeouts', () => {
    const { result, rerender } = createTransitionTester(defaultConfig);

    result.updateVisibility(false);
    rerender(); // Simulate unmount
    expect(result.state).toBe('exited');
  });

  test('handles rapid transitions', () => {
    const { result } = createTransitionTester(defaultConfig);

    result.updateVisibility(false);
    result.updateVisibility(true);
    expect(result.state).toBe('entering');
    expect(result.isRendered).toBeTruthy();
  });

  test('respects reduced motion preferences', () => {
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      }),
    });

    const { result } = createTransitionTester(defaultConfig);
    const props = result.getTransitionProps();
    expect(props.style.transition).toBe('none');
  });
});