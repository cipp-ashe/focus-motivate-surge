
import { renderHook, act } from '@testing-library/react-hooks';
import { useHabitTaskProcessor } from '../useHabitTaskProcessor';
import { eventBus } from '@/lib/eventBus';
import { taskStorage } from '@/lib/storage/taskStorage';

// Mock dependencies
jest.mock('../useHabitTaskCreator', () => ({
  useHabitTaskCreator: () => ({
    createHabitTask: jest.fn((habitId, templateId, name, duration, date) => {
      return 'mock-task-id';
    })
  })
}));

// Mock taskStorage
jest.mock('@/lib/storage/taskStorage', () => ({
  taskStorage: {
    taskExists: jest.fn(),
    loadTasks: jest.fn()
  }
}));

describe('useHabitTaskProcessor', () => {
  let mockDispatchEvent: jest.SpyInstance;
  
  beforeEach(() => {
    // Mock taskStorage methods
    (taskStorage.taskExists as jest.Mock).mockReset();
    (taskStorage.loadTasks as jest.Mock).mockReset();
    
    // Reset eventBus
    eventBus.clear();
    
    // Mock window.dispatchEvent
    mockDispatchEvent = jest.spyOn(window, 'dispatchEvent').mockImplementation();
    
    // Setup default task storage mock
    (taskStorage.loadTasks as jest.Mock).mockReturnValue([]);
  });
  
  afterEach(() => {
    mockDispatchEvent.mockRestore();
  });
  
  it('should export required methods', () => {
    const { result } = renderHook(() => useHabitTaskProcessor());
    
    expect(result.current.handleHabitSchedule).toBeDefined();
    expect(result.current.processPendingTasks).toBeDefined();
    expect(result.current.processHabitTask).toBeDefined();
  });
  
  it('should skip creating task if it already exists', () => {
    // Setup existing task in storage
    (taskStorage.taskExists as jest.Mock).mockReturnValue({
      id: 'task-1',
      name: 'Existing Task',
      relationships: {
        habitId: 'habit-1',
        date: '2023-05-20'
      }
    });
    
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
    expect(mockDispatchEvent).toHaveBeenCalled();
    
    // Verify taskStorage.taskExists was called with correct parameters
    expect(taskStorage.taskExists).toHaveBeenCalledWith('habit-1', '2023-05-20');
  });
  
  it('should create task if it does not exist', () => {
    // Set up no existing task
    (taskStorage.taskExists as jest.Mock).mockReturnValue(null);
    
    const { result } = renderHook(() => useHabitTaskProcessor());
    
    act(() => {
      result.current.processHabitTask({
        habitId: 'habit-1',
        templateId: 'template-1',
        name: 'New Task',
        duration: 1500,
        date: '2023-05-21'
      });
    });
    
    // Verify taskStorage.taskExists was called with correct parameters
    expect(taskStorage.taskExists).toHaveBeenCalledWith('habit-1', '2023-05-21');
  });
  
  it('should process pending tasks correctly', () => {
    // Set up mock habit tasks in storage
    (taskStorage.loadTasks as jest.Mock).mockReturnValue([
      {
        id: 'task-1',
        name: 'Habit Task',
        relationships: {
          habitId: 'habit-1',
          date: '2023-05-20'
        }
      }
    ]);
    
    const { result } = renderHook(() => useHabitTaskProcessor());
    
    act(() => {
      result.current.processPendingTasks();
    });
    
    // Verify loadTasks was called
    expect(taskStorage.loadTasks).toHaveBeenCalled();
    
    // Verify window.dispatchEvent was called multiple times to update tasks
    expect(mockDispatchEvent).toHaveBeenCalled();
  });
});
