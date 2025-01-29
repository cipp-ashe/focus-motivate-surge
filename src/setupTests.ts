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
window.matchMedia = (query: string): MediaQueryList => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
});

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
global.Audio = MockAudio as any;
global.IntersectionObserver = MockIntersectionObserver as any;

beforeEach(() => {
  jest.clearAllMocks();
});

export {};