
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

// Mock processors
jest.mock('../processors/useTaskTypeProcessor', () => ({
  useTaskTypeProcessor: () => ({
    determineTaskType: jest.fn((taskType, metricType, name) => 'regular'),
    isValidTaskType: jest.fn(type => true)
  })
}));

jest.mock('../processors/useHabitEventProcessor', () => ({
  useHabitEventProcessor: () => ({
    processHabitScheduleEvent: jest.fn(event => event)
  })
}));

jest.mock('../processors/useTaskCreationProcessor', () => ({
  useTaskCreationProcessor: () => ({
    processHabitTask: jest.fn()
  })
}));

jest.mock('../processors/usePendingTaskProcessor', () => ({
  usePendingTaskProcessor: () => ({
    processPendingTasks: jest.fn(() => true)
  })
}));

// Mock hooks
jest.mock('@/hooks/useEvent', () => ({
  useEvent: jest.fn((event, handler) => {
    // Simple mock of useEvent
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
  
  it('should handle habit schedule events', () => {
    const { result } = renderHook(() => useHabitTaskProcessor());
    
    act(() => {
      result.current.handleHabitSchedule({
        habitId: 'habit-1',
        templateId: 'template-1',
        name: 'Test Task',
        duration: 1500,
        date: '2023-05-20'
      });
    });
  });
  
  it('should process pending tasks', () => {
    const { result } = renderHook(() => useHabitTaskProcessor());
    
    act(() => {
      result.current.processPendingTasks();
    });
  });
});
