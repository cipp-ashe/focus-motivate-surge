import { renderHook, act } from '@testing-library/react-hooks';
import { useTaskStorage } from '../useTaskStorage';
import { eventBus } from '@/lib/eventBus';

describe('useTaskStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    eventBus.clear();
  });

  it('should initialize with empty tasks', () => {
    const { result } = renderHook(() => useTaskStorage());
    expect(result.current.items).toEqual([]);
    expect(result.current.completed).toEqual([]);
  });

  it('should handle task creation through event bus', () => {
    const { result } = renderHook(() => useTaskStorage());
    
    act(() => {
      eventBus.emit('task:create', {
        id: '1',
        name: 'Test Task',
        completed: false,
        createdAt: new Date().toISOString()
      });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('Test Task');
  });

  it('should handle task updates through event bus', () => {
    const { result } = renderHook(() => useTaskStorage());
    
    act(() => {
      eventBus.emit('task:create', {
        id: '1',
        name: 'Test Task',
        completed: false,
        createdAt: new Date().toISOString()
      });

      eventBus.emit('task:update', {
        taskId: '1',
        updates: { name: 'Updated Task' }
      });
    });

    expect(result.current.items[0].name).toBe('Updated Task');
  });

  it('should handle task deletion', () => {
    const { result } = renderHook(() => useTaskStorage());
    
    act(() => {
      eventBus.emit('task:create', {
        id: '1',
        name: 'Test Task',
        completed: false,
        createdAt: new Date().toISOString()
      });

      eventBus.emit('task:delete', { taskId: '1', reason: 'manual' });
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should persist tasks to localStorage', () => {
    const { result } = renderHook(() => useTaskStorage());
    
    act(() => {
      eventBus.emit('task:create', {
        id: '1',
        name: 'Test Task',
        completed: false,
        createdAt: new Date().toISOString()
      });
    });

    const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
    expect(storedTasks).toHaveLength(1);
    expect(storedTasks[0].name).toBe('Test Task');
  });
});
