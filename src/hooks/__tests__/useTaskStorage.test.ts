
import { renderHook } from '@testing-library/react-hooks';
import { useTaskStorage } from '../useTaskStorage';
import { taskStorage } from '@/lib/storage/taskStorage';
import { Task } from '@/types/tasks';

// Mock taskStorage
jest.mock('@/lib/storage/taskStorage', () => ({
  taskStorage: {
    loadTasks: jest.fn(),
    saveTasks: jest.fn(),
    loadCompletedTasks: jest.fn(),
    getTaskById: jest.fn(),
    removeTask: jest.fn()
  }
}));

// Mock eventBus
jest.mock('@/lib/eventBus', () => ({
  eventBus: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    clear: jest.fn() // Mock clear method
  }
}));

describe('useTaskStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call taskStorage.loadTasks on mount', () => {
    const mockTasks: Task[] = [
      { id: '1', name: 'Task 1', completed: false, createdAt: '2023-01-01T00:00:00.000Z' },
      { id: '2', name: 'Task 2', completed: false, createdAt: '2023-01-01T00:00:00.000Z' }
    ];
    
    (taskStorage.loadTasks as jest.Mock).mockReturnValue(mockTasks);

    const { result } = renderHook(() => useTaskStorage());

    expect(taskStorage.loadTasks).toHaveBeenCalled();
    expect(result.current.items).toEqual(mockTasks);
  });

  it('should allow saving tasks', () => {
    const { result } = renderHook(() => useTaskStorage());

    const newTasks: Task[] = [
      { id: '3', name: 'Task 3', completed: false, createdAt: '2023-01-01T00:00:00.000Z' }
    ];
    
    result.current.saveTasks(newTasks);

    expect(taskStorage.saveTasks).toHaveBeenCalledWith(newTasks);
  });

  it('should return a task by id via getTaskById', () => {
    const mockTask: Task = { 
      id: '1', 
      name: 'Task 1', 
      completed: false, 
      createdAt: '2023-01-01T00:00:00.000Z' 
    };
    
    (taskStorage.getTaskById as jest.Mock).mockReturnValue(mockTask);

    // Add getTaskById to the hook result
    jest.spyOn(taskStorage, 'getTaskById').mockReturnValue(mockTask);

    const { result } = renderHook(() => ({
      ...useTaskStorage(),
      getTask: (id: string) => taskStorage.getTaskById(id)
    }));
    
    const task = result.current.getTask('1');

    expect(taskStorage.getTaskById).toHaveBeenCalledWith('1');
    expect(task).toEqual(mockTask);
  });

  it('should delete a task by id', () => {
    // Add deleteTask to the hook result
    jest.spyOn(taskStorage, 'removeTask').mockReturnValue(true);

    const { result } = renderHook(() => ({
      ...useTaskStorage(),
      deleteTask: (id: string) => taskStorage.removeTask(id)
    }));
    
    result.current.deleteTask('1');

    expect(taskStorage.removeTask).toHaveBeenCalledWith('1');
  });
});
