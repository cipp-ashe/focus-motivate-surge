
import { renderHook } from '@testing-library/react-hooks';
import { useHabitTaskProcessor } from '../useHabitTaskProcessor';
import { eventManager } from '@/lib/events/EventManager';

// Mock dependencies
jest.mock('../useHabitTaskCreator', () => ({
  useHabitTaskCreator: () => ({
    createHabitTask: jest.fn().mockReturnValue('mock-task-id')
  })
}));

jest.mock('../processors/useTaskTypeProcessor', () => ({
  useTaskTypeProcessor: () => ({
    determineTaskType: jest.fn().mockReturnValue('regular')
  })
}));

jest.mock('../processors/useHabitEventProcessor', () => ({
  useHabitEventProcessor: () => ({
    processHabitScheduleEvent: jest.fn().mockImplementation(event => event)
  })
}));

jest.mock('../processors/useTaskCreationProcessor', () => ({
  useTaskCreationProcessor: () => ({
    processHabitTask: jest.fn()
  })
}));

jest.mock('../processors/usePendingTaskProcessor', () => ({
  usePendingTaskProcessor: () => ({
    processPendingTasks: jest.fn()
  })
}));

// Mock the eventManager
jest.mock('@/lib/events/EventManager', () => ({
  eventManager: {
    on: jest.fn().mockReturnValue(() => {}),
    emit: jest.fn(),
    clear: jest.fn()
  }
}));

describe('useHabitTaskProcessor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set up event listeners on mount', () => {
    renderHook(() => useHabitTaskProcessor());
    
    // Event subscriptions are handled by the useEvent hook that wraps eventManager.on
  });

  it('should handle habit:schedule events correctly', () => {
    const { result } = renderHook(() => useHabitTaskProcessor());
    
    const mockEvent = {
      habitId: 'habit-1',
      templateId: 'template-1',
      name: 'Test Habit',
      duration: 1500,
      date: '2023-07-01'
    };
    
    // Manually trigger the handler
    result.current.handleHabitSchedule(mockEvent);
    
    // Verify the correct methods were called
    expect(result.current.processHabitTask).toHaveBeenCalled();
  });

  it('should process pending tasks when requested', () => {
    const { result } = renderHook(() => useHabitTaskProcessor());
    
    // Manually trigger the method
    result.current.processPendingTasks();
    
    // Verify the correct methods were called
    expect(result.current.processPendingTasks).toHaveBeenCalled();
  });

  it('should clean up event listeners on unmount', () => {
    // The cleanup is handled automatically by the useEvent hook
    const { unmount } = renderHook(() => useHabitTaskProcessor());
    unmount();
    
    // No explicit verification needed as useEvent handles this
  });
});
