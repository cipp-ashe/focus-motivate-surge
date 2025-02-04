import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { describe, test, expect } from '@jest/globals';

// Create a test wrapper that provides React context
export const createTestWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => {
    return children;
  };
};

// Create a hook tester that handles state updates
export const createHookTester = <T extends (...args: any[]) => any>(hook: T) => {
  return (initialProps: Parameters<T>[0]) => {
    const { result, rerender: baseRerender } = renderHook(
      (props) => hook(props),
      {
        wrapper: createTestWrapper(),
        initialProps,
      }
    );

    const rerender = (newProps = initialProps) => {
      act(() => {
        baseRerender(newProps);
      });
    };

    return {
      result,
      rerender,
    };
  };
};

export { describe, test, expect };