
import { jest } from '@jest/globals';

// Mock sonner toast types
interface ToastFn {
  (message: string): { id: string };
  error: jest.Mock;
  success: jest.Mock;
  message: jest.Mock;
}

// Create mock toast function
export const mockToast = Object.assign(
  jest.fn(() => ({ id: 'mock-toast-id' })),
  {
    error: jest.fn(),
    success: jest.fn(),
    message: jest.fn(),
  }
) as ToastFn;

// Setup mock for sonner module
jest.mock('sonner', () => ({
  __esModule: true,
  toast: mockToast
}));

