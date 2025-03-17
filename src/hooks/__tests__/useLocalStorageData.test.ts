
import { renderHook, act } from '@testing-library/react-hooks';
import { useLocalStorageData } from '../useLocalStorageData';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; })
  };
})();
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock eventBus
jest.mock('@/lib/eventBus', () => ({
  eventBus: {
    on: jest.fn(),
    emit: jest.fn(),
    off: jest.fn(),
    clear: jest.fn() // add a mock for the clear method
  }
}));

describe('useLocalStorageData', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  it('should load data from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify([{ id: 1, name: 'Task 1' }]));
    
    const { result } = renderHook(() => useLocalStorageData('tasks', []));
    
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('tasks');
    expect(result.current[0]).toEqual([{ id: 1, name: 'Task 1' }]);
  });

  it('should use default value if localStorage is empty', () => {
    mockLocalStorage.getItem.mockReturnValueOnce(null);
    
    const { result } = renderHook(() => useLocalStorageData('tasks', [{ id: 2, name: 'Default Task' }]));
    
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('tasks');
    expect(result.current[0]).toEqual([{ id: 2, name: 'Default Task' }]);
  });

  it('should update localStorage when data changes', () => {
    const { result } = renderHook(() => useLocalStorageData('tasks', []));
    
    act(() => {
      result.current[1]([{ id: 3, name: 'New Task' }]);
    });
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify([{ id: 3, name: 'New Task' }]));
  });

  it('should handle JSON parse errors gracefully', () => {
    // Return invalid JSON
    mockLocalStorage.getItem.mockReturnValueOnce('invalid json');
    
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const { result } = renderHook(() => useLocalStorageData('tasks', []));
    
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result.current[0]).toEqual([]);
    
    consoleErrorSpy.mockRestore();
  });

  it('should clear data by setting empty value', () => {
    const { result } = renderHook(() => useLocalStorageData('tasks', [{ id: 1 }]));
    
    act(() => {
      // Set empty array to clear data
      result.current[1]([]);
    });
    
    expect(result.current[0]).toEqual([]);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify([]));
  });
});
