
import { renderHook, act } from '@testing-library/react-hooks';
import { useTaskStorage } from '../useTaskStorage';

describe('useTaskStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty tasks', () => {
    const { result } = renderHook(() => useTaskStorage());
    expect(result.current.tasks).toEqual([]);
  });

  it('should add and retrieve tasks', () => {
    const { result } = renderHook(() => useTaskStorage());
    const newTask = { id: '1', name: 'Test Task', completed: false };

    act(() => {
      result.current.addTask(newTask);
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].name).toBe('Test Task');
  });

  it('should update tasks', () => {
    const { result } = renderHook(() => useTaskStorage());
    const task = { id: '1', name: 'Test Task', completed: false };

    act(() => {
      result.current.addTask(task);
      result.current.updateTask('1', { name: 'Updated Task' });
    });

    expect(result.current.tasks[0].name).toBe('Updated Task');
  });

  it('should delete tasks', () => {
    const { result } = renderHook(() => useTaskStorage());
    const task = { id: '1', name: 'Test Task', completed: false };

    act(() => {
      result.current.addTask(task);
      result.current.deleteTask('1');
    });

    expect(result.current.tasks).toHaveLength(0);
  });
});
