
import { renderHook } from '@testing-library/react-hooks';
import { useTaskStorage } from '../useTaskStorage';
import { taskStorage } from '@/lib/storage/taskStorage';

// Mock taskStorage
jest.mock('@/lib/storage/taskStorage', () => ({
  taskStorage: {
    loadTasks: jest.fn(),
    saveTasks: jest.fn(),
    getTask: jest.fn(),
    deleteTask: jest.fn()
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
    (taskStorage.loadTasks as jest.Mock).mockReturnValue([
      { id: '1', name: 'Task 1' },
      { id: '2', name: 'Task 2' }
    ]);

    const { result } = renderHook(() => useTaskStorage());

    expect(taskStorage.loadTasks).toHaveBeenCalled();
    expect(result.current.tasks).toEqual([
      { id: '1', name: 'Task 1' },
      { id: '2', name: 'Task 2' }
    ]);
  });

  it('should allow saving tasks', () => {
    const { result } = renderHook(() => useTaskStorage());

    const newTasks = [{ id: '3', name: 'Task 3' }];
    result.current.saveTasks(newTasks);

    expect(taskStorage.saveTasks).toHaveBeenCalledWith(newTasks);
  });

  it('should return a task by id', () => {
    const mockTask = { id: '1', name: 'Task 1' };
    (taskStorage.getTask as jest.Mock).mockReturnValue(mockTask);

    const { result } = renderHook(() => useTaskStorage());
    const task = result.current.getTask('1');

    expect(taskStorage.getTask).toHaveBeenCalledWith('1');
    expect(task).toEqual(mockTask);
  });

  it('should delete a task by id', () => {
    const { result } = renderHook(() => useTaskStorage());
    result.current.deleteTask('1');

    expect(taskStorage.deleteTask).toHaveBeenCalledWith('1');
  });
});
