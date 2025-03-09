
import { taskVerification } from '../taskVerification';
import { taskStorage } from '../../storage/taskStorage';
import { Task } from '@/types/tasks';

// Mock dependencies
jest.mock('../../storage/taskStorage', () => ({
  taskStorage: {
    loadTasks: jest.fn(),
    saveTasks: jest.fn()
  }
}));

jest.mock('sonner', () => ({
  toast: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('taskVerification', () => {
  beforeEach(() => {
    // Reset mocks
    (taskStorage.loadTasks as jest.Mock).mockReset();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should verify all tasks are loaded correctly', () => {
    // Mock tasks in storage
    const storedTasks: Task[] = [
      { id: 'task-1', name: 'Task 1', completed: false, createdAt: '2023-01-01' },
      { id: 'task-2', name: 'Task 2', completed: false, createdAt: '2023-01-01' }
    ];
    
    (taskStorage.loadTasks as jest.Mock).mockReturnValue(storedTasks);
    
    // Test with all tasks in memory
    const memoryTasks = [...storedTasks];
    const result = taskVerification.verifyAllTasksLoaded(memoryTasks);
    
    expect(result).toBe(true);
    expect(taskStorage.loadTasks).toHaveBeenCalled();
  });
  
  it('should detect missing tasks', () => {
    // Mock tasks in storage
    const storedTasks: Task[] = [
      { id: 'task-1', name: 'Task 1', completed: false, createdAt: '2023-01-01' },
      { id: 'task-2', name: 'Task 2', completed: false, createdAt: '2023-01-01' }
    ];
    
    (taskStorage.loadTasks as jest.Mock).mockReturnValue(storedTasks);
    
    // Test with missing tasks in memory
    const memoryTasks: Task[] = [
      { id: 'task-1', name: 'Task 1', completed: false, createdAt: '2023-01-01' }
    ];
    
    const result = taskVerification.verifyAllTasksLoaded(memoryTasks);
    
    expect(result).toBe(false);
    expect(taskStorage.loadTasks).toHaveBeenCalled();
  });
  
  it('should recover missing tasks', () => {
    // Mock tasks in storage
    const storedTasks: Task[] = [
      { id: 'task-1', name: 'Task 1', completed: false, createdAt: '2023-01-01' },
      { id: 'task-2', name: 'Task 2', completed: false, createdAt: '2023-01-01' }
    ];
    
    (taskStorage.loadTasks as jest.Mock).mockReturnValue(storedTasks);
    
    // Test with missing tasks in memory
    const memoryTasks: Task[] = [
      { id: 'task-1', name: 'Task 1', completed: false, createdAt: '2023-01-01' }
    ];
    
    const recoveredTasks = taskVerification.recoverMissingTasks(memoryTasks);
    
    expect(recoveredTasks).toHaveLength(1);
    expect(recoveredTasks[0].id).toBe('task-2');
  });
  
  it('should recover missing habit tasks only', () => {
    // Mock tasks in storage
    const storedTasks: Task[] = [
      { id: 'task-1', name: 'Regular Task', completed: false, createdAt: '2023-01-01' },
      { 
        id: 'task-2', 
        name: 'Habit Task', 
        completed: false, 
        createdAt: '2023-01-01',
        relationships: { habitId: 'habit-1', date: '2023-01-01' }
      },
      { 
        id: 'task-3', 
        name: 'Another Habit Task', 
        completed: false, 
        createdAt: '2023-01-01',
        relationships: { habitId: 'habit-2', date: '2023-01-01' }
      }
    ];
    
    (taskStorage.loadTasks as jest.Mock).mockReturnValue(storedTasks);
    
    // Test with missing habit tasks in memory
    const memoryTasks: Task[] = [
      { id: 'task-1', name: 'Regular Task', completed: false, createdAt: '2023-01-01' },
      { 
        id: 'task-2', 
        name: 'Habit Task', 
        completed: false, 
        createdAt: '2023-01-01',
        relationships: { habitId: 'habit-1', date: '2023-01-01' } 
      }
    ];
    
    const recoveredTasks = taskVerification.recoverMissingHabitTasks(memoryTasks);
    
    expect(recoveredTasks).toHaveLength(1);
    expect(recoveredTasks[0].id).toBe('task-3');
    expect(recoveredTasks[0].relationships?.habitId).toBe('habit-2');
  });
  
  it('should set up periodic verification', () => {
    jest.useFakeTimers();
    
    // Mock functions
    const getMemoryTasks = jest.fn().mockReturnValue([
      { id: 'task-1', name: 'Task 1', completed: false, createdAt: '2023-01-01' }
    ]);
    
    const onMissingTasksFound = jest.fn();
    
    // Mock storage to return additional tasks
    (taskStorage.loadTasks as jest.Mock).mockReturnValue([
      { id: 'task-1', name: 'Task 1', completed: false, createdAt: '2023-01-01' },
      { id: 'task-2', name: 'Task 2', completed: false, createdAt: '2023-01-01' }
    ]);
    
    // Set up verification with a short interval for testing
    const cleanup = taskVerification.setupPeriodicVerification(
      getMemoryTasks,
      onMissingTasksFound,
      1000 // 1 second
    );
    
    // Fast-forward time
    jest.advanceTimersByTime(1000);
    
    // Verification should have run
    expect(getMemoryTasks).toHaveBeenCalled();
    expect(onMissingTasksFound).toHaveBeenCalledWith([
      { id: 'task-2', name: 'Task 2', completed: false, createdAt: '2023-01-01' }
    ]);
    
    // Clean up
    cleanup();
    jest.useRealTimers();
  });
});
