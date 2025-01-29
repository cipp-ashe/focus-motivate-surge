// Types for mock React hooks environment
type SetStateAction<T> = T | ((prev: T) => T);
type EffectCallback = () => (void | (() => void));
type DependencyList = ReadonlyArray<unknown>;
type CleanupFunction = () => void;

// Generic function type with explicit unknown parameters
type AnyFunction = {
  (...args: unknown[]): unknown;
};

interface HookStates {
  [key: string]: unknown;
}

interface HookTester<T> {
  result: T;
  rerender: () => void;
  advanceTime: (ms: number) => void;
  getState: <S>(key: string) => S;
}

export class HookEnvironment {
  private states: HookStates = {};
  private effects: EffectCallback[] = [];
  private cleanups: (CleanupFunction | undefined)[] = [];
  private currentEffect = 0;

  useState<T>(initialValue: T): [T, (value: SetStateAction<T>) => void] {
    const key = Object.keys(this.states).length.toString();
    if (!(key in this.states)) {
      this.states[key] = initialValue;
    }
    
    return [
      this.states[key] as T,
      (value: SetStateAction<T>) => {
        this.states[key] = value instanceof Function ? value(this.states[key] as T) : value;
      },
    ];
  }

  useEffect(effect: EffectCallback, deps?: DependencyList): void {
    if (!this.effects[this.currentEffect]) {
      this.effects[this.currentEffect] = effect;
      const maybeCleanup = effect();
      if (typeof maybeCleanup === 'function') {
        this.cleanups[this.currentEffect] = maybeCleanup;
      }
    }
    this.currentEffect++;
  }

  useCallback<T extends AnyFunction>(callback: T, deps?: DependencyList): T {
    return callback;
  }

  rerender(): void {
    this.currentEffect = 0;
    // Execute cleanups in reverse order
    for (let i = this.cleanups.length - 1; i >= 0; i--) {
      const cleanup = this.cleanups[i];
      if (cleanup) {
        cleanup();
      }
    }
    // Run effects and collect new cleanups
    this.effects.forEach((effect, i) => {
      const maybeCleanup = effect();
      if (typeof maybeCleanup === 'function') {
        this.cleanups[i] = maybeCleanup;
      } else {
        this.cleanups[i] = undefined;
      }
    });
  }

  getState<T>(key: string): T {
    return this.states[key] as T;
  }
}

export function createHookTester<TParams extends unknown[], TResult>(
  hook: (...args: TParams) => TResult
): (params: TParams[0]) => HookTester<TResult> {
  return (params: TParams[0]) => {
    const env = new HookEnvironment();

    // Mock React hooks
    const React = {
      useState: env.useState.bind(env),
      useEffect: env.useEffect.bind(env),
      useCallback: env.useCallback.bind(env),
    };

    // Run hook with mocked React environment
    const result = hook.call(null, params);

    return {
      result,
      rerender: () => env.rerender(),
      advanceTime: (ms: number) => {
        // Simulate time passing
        setTimeout(() => env.rerender(), ms);
      },
      getState: <T>(key: string) => env.getState<T>(key),
    };
  };
}

// Export mock React for use in tests
export const mockReact = {
  useState: <T>(initialValue: T): [T, (value: SetStateAction<T>) => void] => {
    throw new Error('useState called outside of test environment');
  },
  useEffect: (effect: EffectCallback, deps?: DependencyList): void => {
    throw new Error('useEffect called outside of test environment');
  },
  useCallback: <T extends AnyFunction>(callback: T, deps?: DependencyList): T => {
    throw new Error('useCallback called outside of test environment');
  },
};