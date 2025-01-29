/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveStyle(style: { [key: string]: any }): R;
      toHaveAttribute(attr: string, value?: string): R;
    }
  }
}

// Mock window.matchMedia
const mockMatchMedia = (query: string): MediaQueryList => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => undefined,
  removeListener: () => undefined,
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => undefined,
  removeEventListener: (type: string, listener: EventListenerOrEventListenerObject) => undefined,
  dispatchEvent: () => false,
});

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia,
  });
}

// Mock Audio API
class MockAudio implements Partial<HTMLAudioElement> {
  src: string;
  constructor(src: string) {
    this.src = src;
  }
  play(): Promise<void> {
    return Promise.resolve();
  }
}

// Mock IntersectionObserver
class MockIntersectionObserver implements Partial<IntersectionObserver> {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}

  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

// Set up global mocks
if (typeof window !== 'undefined') {
  global.Audio = MockAudio as any;
  global.IntersectionObserver = MockIntersectionObserver as any;
}

beforeEach(() => {
  jest.clearAllMocks();
});

export {};