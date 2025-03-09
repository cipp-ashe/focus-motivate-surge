
import { renderHook, act } from '@testing-library/react-hooks';
import { useHabitTaskProcessor } from '../useHabitTaskProcessor';
import { eventBus } from '@/lib/eventBus';

// Mock dependencies
jest.mock('../useHabitTaskCreator', () => ({
  useHabitTaskCreator: () => ({
    createHabitTask: jest.fn()
  })
}));

describe('useHabitTaskProcessor', () => {
  // Mock localStorage
  let mockLocalStorage: Record<string, string> = {};
  
  beforeEach(() => {
    // Setup localStorage mock
    mockLocalStorage = {};
    
    Storage.prototype.getItem = jest.fn(
      (key: string) => mockLocalStorage[key] || null
    );
    
    Storage.prototype.setItem = jest.fn(
      (key: string, value: string) => {
        mockLocalStorage[key] = value;
      }
    );
    
    // Clear event bus
    eventBus.clear();
    
    // Mock window.dispatchEvent
    window.dispatchEvent = jest.fn();
  });
  
  it('should export required methods', () => {
    const { result } = renderHook(() => useHabitTaskProcessor());
    
    expect(result.current.handleHabitSchedule).toBeDefined();
    expect(result.current.processPendingTasks).toBeDefined();
    expect(result.current.processHabitTask).toBeDefined();
  });
  
  it('should skip creating task if it already exists', () => {
    // Setup existing task in localStorage
    const existingTask = {
      id: 'task-1',
      name: 'Existing Task',
      relationships: {
        habitId: 'habit-1',
        date: '2023-05-20'
      }
    };
    
    mockLocalStorage['taskList'] = JSON.stringify([existingTask]);
    
    const { result } = renderHook(() => useHabitTaskProcessor());
    
    act(() => {
      result.current.processHabitTask({
        habitId: 'habit-1',
        templateId: 'template-1',
        name: 'Test Task',
        duration: 1500,
        date: '2023-05-20'
      });
    });
    
    // Verify window.dispatchEvent was called to update tasks
    expect(window.dispatchEvent).toHaveBeenCalled();
  });
});
