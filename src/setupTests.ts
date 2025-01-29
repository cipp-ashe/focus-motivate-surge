/// <reference types="@testing-library/jest-dom" />

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveStyle(style: { [key: string]: any }): R;
      toHaveAttribute(attr: string, value?: string): R;
    }
  }

  interface Window {
    matchMedia(query: string): MediaQueryList;
  }

  // Define types for our mocks
  interface MediaQueryList {
    matches: boolean;
    media: string;
    onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null;
    addListener: (callback: (this: MediaQueryList, ev: MediaQueryListEvent) => any) => void;
    removeListener: (callback: (this: MediaQueryList, ev: MediaQueryListEvent) => any) => void;
    addEventListener: (type: string, listener: EventListener) => void;
    removeEventListener: (type: string, listener: EventListener) => void;
    dispatchEvent: (event: Event) => boolean;
  }
}

// Mock requestAnimationFrame and cancelAnimationFrame
declare const requestAnimationFrame: (callback: FrameRequestCallback) => number;
declare const cancelAnimationFrame: (handle: number) => void;

// Mock window.matchMedia
const mockMatchMedia = (query: string): MediaQueryList => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => undefined,
  removeListener: () => undefined,
  addEventListener: () => undefined,
  removeEventListener: () => undefined,
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

// Clear all mocks before each test
beforeEach(() => {
  // This will be replaced by the actual jest.clearAllMocks() when jest is installed
  const mockClear = () => {};
  mockClear();
});

export {};