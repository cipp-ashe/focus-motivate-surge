import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';

// Mock React
const React = {
  jsx: jest.fn(),
  jsxs: jest.fn(),
  createElement: jest.fn(),
  Fragment: Symbol('Fragment'),
  Component: class {},
  PureComponent: class {},
  memo: jest.fn(),
  forwardRef: jest.fn(),
  createContext: jest.fn(),
  useContext: jest.fn(),
};

// Export mock React hooks
export const mockReactHooks = {
  useState: jest.fn(),
  useEffect: jest.fn(),
  useCallback: jest.fn(),
  useMemo: jest.fn(),
  useRef: jest.fn(),
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Export mocked React
export { React };