
import '@testing-library/jest-dom';
import { beforeEach, jest } from '@jest/globals';
import './testUtils/mockToast';

// Mock event listeners that can be used across tests
global.mockAddEventListener = jest.fn();
global.mockRemoveEventListener = jest.fn();

// Extend global types
declare global {
  var mockAddEventListener: jest.Mock;
  var mockRemoveEventListener: jest.Mock;
}

beforeEach(() => {
  // Reset all mocks and state
  jest.clearAllMocks();
});
