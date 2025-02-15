import { renderHook, act } from '@testing-library/react-hooks';
import { useLocalStorageData } from '../useLocalStorageData';
import { ActiveTemplate, DayOfWeek } from '@/components/habits/types';
import type { Task } from '@/types/tasks';

const mockTemplate: ActiveTemplate = {
  templateId: 'test-1',
  habits: [],
  customized: false,
  activeDays: ['Mon', 'Wed', 'Fri'] as DayOfWeek[],
};

describe('useLocalStorageData', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty templates if no data in localStorage', () => {
    const { result } = renderHook(() => useLocalStorageData());
    expect(result.current.activeTemplates).toEqual([]);
  });

  it('should load templates from localStorage', () => {
    localStorage.setItem('active-templates', JSON.stringify([mockTemplate]));
    const { result } = renderHook(() => useLocalStorageData());
    expect(result.current.activeTemplates).toEqual([mockTemplate]);
  });

  it('should load tasks from localStorage', () => {
    const mockTasks: Task[] = [{
      id: 'task-1',
      name: 'Test Task',
      completed: false,
      createdAt: new Date().toISOString(),
    }];
    localStorage.setItem('taskList', JSON.stringify(mockTasks));
    const { result } = renderHook(() => useLocalStorageData());
    expect(result.current.tasks).toEqual(mockTasks);
  });

  it('should load completed tasks from localStorage', () => {
    const mockCompletedTasks: Task[] = [{
      id: 'task-1',
      name: 'Completed Task',
      completed: true,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    }];
    localStorage.setItem('completedTasks', JSON.stringify(mockCompletedTasks));
    const { result } = renderHook(() => useLocalStorageData());
    expect(result.current.completedTasks).toEqual(mockCompletedTasks);
  });

  it('should update last sync date', () => {
    const { result } = renderHook(() => useLocalStorageData());
    const newDate = new Date();
    
    act(() => {
      result.current.handleLastSyncUpdate(newDate);
    });

    expect(localStorage.getItem('lastSync')).toBe(newDate.toISOString());
  });

  it('should handle tasks update', () => {
    const { result } = renderHook(() => useLocalStorageData());
    const newTasks: Task[] = [{
      id: 'task-1',
      name: 'New Task',
      completed: false,
      createdAt: new Date().toISOString(),
    }];

    act(() => {
      result.current.handleTasksUpdate(newTasks);
    });

    expect(JSON.parse(localStorage.getItem('taskList') || '[]')).toEqual(newTasks);
  });

  it('should handle completed tasks update', () => {
    const { result } = renderHook(() => useLocalStorageData());
    const completedTasks: Task[] = [{
      id: 'task-1',
      name: 'Completed Task',
      completed: true,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    }];

    act(() => {
      result.current.handleCompletedTasksUpdate(completedTasks);
    });

    expect(JSON.parse(localStorage.getItem('completedTasks') || '[]')).toEqual(completedTasks);
  });

  it('should handle templates update', () => {
    const { result } = renderHook(() => useLocalStorageData());
    const templates: ActiveTemplate[] = [mockTemplate];

    act(() => {
      result.current.setActiveTemplates(templates);
    });

    expect(JSON.parse(localStorage.getItem('active-templates') || '[]')).toEqual(templates);
  });
});
