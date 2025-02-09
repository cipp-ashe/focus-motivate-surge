
import { jest } from '@jest/globals';

// Get actual React module
const actualReact = jest.requireActual('react');

// Mock React with state persistence
const states = new Map<string, any>();
let stateCounter = 0;

// Mock React
export const mockReact = {
  // JSX Support
  default: actualReact,
  jsx: actualReact.jsx,
  jsxs: actualReact.jsxs,
  createElement: actualReact.createElement,
  Fragment: actualReact.Fragment,
  
  // Component Support
  Component: actualReact.Component,
  PureComponent: actualReact.PureComponent,
  memo: actualReact.memo,
  forwardRef: actualReact.forwardRef,
  
  // Context Support
  createContext: actualReact.createContext,
  useContext: actualReact.useContext,

  // Hooks with state persistence
  useState: (initial: any) => {
    const key = `state_${stateCounter++}`;
    if (!states.has(key)) {
      states.set(key, initial);
    }
    const setState = (value: any) => {
      states.set(key, typeof value === 'function' ? value(states.get(key)) : value);
    };
    return [states.get(key), setState];
  },
  useEffect: (effect: () => void | (() => void)) => effect(),
  useCallback: (callback: any) => callback,
  useMemo: (factory: any) => factory(),
  useRef: (initial: any) => ({ current: initial }),
};

// Reset function for tests
export const resetReactMocks = () => {
  states.clear();
  stateCounter = 0;
};

