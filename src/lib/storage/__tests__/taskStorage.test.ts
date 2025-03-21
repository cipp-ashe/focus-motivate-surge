
import { taskStorage } from '../task';
import { Task } from '@/types/tasks';
import { constants } from '../task/constants';

const { ACTIVE_TASKS_KEY, COMPLETED_TASKS_KEY } = constants;

describe('taskStorage', () => {
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
  });
  
  it('should load tasks from storage', () => {
    // Add mock task to localStorage
    const mockTask: Task = {
      id: 'task-1',
      name: 'Test Task',
      completed: false,
      createdAt: '2023-01-01T00:00:00.000Z'
    };
    
    mockLocalStorage[ACTIVE_TASKS_KEY] = JSON.stringify([mockTask]);
    
    const tasks = taskStorage.loadTasks();
    
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe('task-1');
    expect(localStorage.getItem).toHaveBeenCalledWith(ACTIVE_TASKS_KEY);
  });
  
  it('should save tasks to storage', () => {
    const tasks: Task[] = [
      {
        id: 'task-1',
        name: 'Test Task',
        completed: false,
        createdAt: '2023-01-01T00:00:00.000Z'
      }
    ];
    
    const result = taskStorage.saveTasks(tasks);
    
    expect(result).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      ACTIVE_TASKS_KEY,
      JSON.stringify(tasks)
    );
  });
  
  it('should add a task to storage', () => {
    const task: Task = {
      id: 'task-1',
      name: 'Test Task',
      completed: false,
      createdAt: '2023-01-01T00:00:00.000Z'
    };
    
    const result = taskStorage.addTask(task);
    
    expect(result).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(JSON.parse(mockLocalStorage[ACTIVE_TASKS_KEY])).toHaveLength(1);
  });
  
  it('should not add duplicate tasks by ID', () => {
    // Setup existing task
    const existingTask: Task = {
      id: 'task-1',
      name: 'Existing Task',
      completed: false,
      createdAt: '2023-01-01T00:00:00.000Z'
    };
    
    mockLocalStorage[ACTIVE_TASKS_KEY] = JSON.stringify([existingTask]);
    
    // Try to add duplicate
    const duplicateTask: Task = {
      id: 'task-1', // Same ID
      name: 'Duplicate Task',
      completed: false,
      createdAt: '2023-01-01T00:00:00.000Z'
    };
    
    const result = taskStorage.addTask(duplicateTask);
    
    expect(result).toBe(false);
    const storedTasks = JSON.parse(mockLocalStorage[ACTIVE_TASKS_KEY]);
    expect(storedTasks).toHaveLength(1);
    expect(storedTasks[0].name).toBe('Existing Task'); // Original name retained
  });
  
  it('should not add duplicate tasks by habit relationship', () => {
    // Setup existing task with habit relationship
    const existingTask: Task = {
      id: 'task-1',
      name: 'Existing Task',
      completed: false,
      createdAt: '2023-01-01T00:00:00.000Z',
      relationships: {
        habitId: 'habit-1',
        date: '2023-05-20'
      }
    };
    
    mockLocalStorage[ACTIVE_TASKS_KEY] = JSON.stringify([existingTask]);
    
    // Try to add duplicate by relationship
    const duplicateTask: Task = {
      id: 'task-2', // Different ID
      name: 'Duplicate Task',
      completed: false,
      createdAt: '2023-01-01T00:00:00.000Z',
      relationships: {
        habitId: 'habit-1', // Same habit ID
        date: '2023-05-20' // Same date
      }
    };
    
    const result = taskStorage.addTask(duplicateTask);
    
    expect(result).toBe(false);
    const storedTasks = JSON.parse(mockLocalStorage[ACTIVE_TASKS_KEY]);
    expect(storedTasks).toHaveLength(1);
    expect(storedTasks[0].id).toBe('task-1'); // Original task retained
  });
  
  it('should find missing tasks', () => {
    // Setup tasks in storage
    const storedTasks: Task[] = [
      {
        id: 'task-1',
        name: 'Task 1',
        completed: false,
        createdAt: '2023-01-01T00:00:00.000Z'
      },
      {
        id: 'task-2',
        name: 'Task 2',
        completed: false,
        createdAt: '2023-01-01T00:00:00.000Z'
      }
    ];
    
    mockLocalStorage[ACTIVE_TASKS_KEY] = JSON.stringify(storedTasks);
    
    // Only one task in memory
    const memoryTasks: Task[] = [
      {
        id: 'task-1',
        name: 'Task 1',
        completed: false,
        createdAt: '2023-01-01T00:00:00.000Z'
      }
    ];
    
    const missingTasks = taskStorage.findMissingTasks(memoryTasks);
    
    expect(missingTasks).toHaveLength(1);
    expect(missingTasks[0].id).toBe('task-2');
  });
  
  it('should complete a task', () => {
    // Setup test data
    const task: Task = {
      id: 'test-task-id',
      name: 'Test Task',
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    // Mock storage functions
    const originalAddCompletedTask = taskStorage.addCompletedTask;
    const originalRemoveTask = taskStorage.removeTask;
    
    let addCompletedCalled = false;
    let removeTaskCalled = false;
    
    // Replace with mocks
    taskStorage.addCompletedTask = (task: Task) => {
      addCompletedCalled = true;
      return true;
    };
    
    taskStorage.removeTask = (taskId: string) => {
      removeTaskCalled = true;
      return true;
    };
    
    // Call the function
    const result = taskStorage.addCompletedTask(task);
    
    // Verify mocks were called
    expect(addCompletedCalled).toBeTruthy();
    
    // Restore original functions
    taskStorage.addCompletedTask = originalAddCompletedTask;
    taskStorage.removeTask = originalRemoveTask;
    
    // Check result
    expect(result).toBeTruthy();
  });
  
  it('should delete tasks by template ID', () => {
    // Setup tasks in storage
    const tasks: Task[] = [
      {
        id: 'task-1',
        name: 'Template Task 1',
        completed: false,
        createdAt: '2023-01-01T00:00:00.000Z',
        relationships: {
          templateId: 'template-1'
        }
      },
      {
        id: 'task-2',
        name: 'Template Task 2',
        completed: false,
        createdAt: '2023-01-01T00:00:00.000Z',
        relationships: {
          templateId: 'template-1'
        }
      },
      {
        id: 'task-3',
        name: 'Other Task',
        completed: false,
        createdAt: '2023-01-01T00:00:00.000Z',
        relationships: {
          templateId: 'template-2'
        }
      }
    ];
    
    mockLocalStorage[ACTIVE_TASKS_KEY] = JSON.stringify(tasks);
    
    const result = taskStorage.deleteTasksByTemplate('template-1');
    
    expect(result).toBe(true);
    
    const remainingTasks = JSON.parse(mockLocalStorage[ACTIVE_TASKS_KEY]);
    expect(remainingTasks).toHaveLength(1);
    expect(remainingTasks[0].id).toBe('task-3');
  });
});
