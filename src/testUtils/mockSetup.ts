import { jest } from '@jest/globals';

export const mockSetState = jest.fn((newValue: any) => {
  const key = (mockSetState as any).currentKey;
  if (typeof newValue === 'function') {
    mockStates.set(key, newValue(mockStates.get(key)));
  } else {
    mockStates.set(key, newValue);
  }
});

// Mock state storage
const mockStates = new Map<string, any>();
let stateCounter = 0;

// Mock useState that uses the stored state
export const mockUseState = jest.fn((initialValue: any) => {
  const key = `state_${stateCounter++}`;
  (mockSetState as any).currentKey = key;
  
  if (!mockStates.has(key)) {
    mockStates.set(key, initialValue);
  }
  
  return [mockStates.get(key), mockSetState];
});

// Setup function to reset all mocks and state
export const setupMockTests = () => {
  mockStates.clear();
  stateCounter = 0;
  mockSetState.mockClear();
  mockUseState.mockClear();
};

// Cleanup function to restore all mocks
export const cleanupMockTests = () => {
  jest.clearAllMocks();
  mockStates.clear();
  stateCounter = 0;
};