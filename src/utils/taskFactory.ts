
import { Task, TaskType, TaskStatus } from '@/types/tasks';
import { v4 as uuidv4 } from 'uuid';

/**
 * Factory for creating task objects with consistent properties
 */
export const taskFactory = {
  /**
   * Create a new task with default values
   */
  createTask: (
    name: string, 
    options?: Partial<Task>
  ): Task => {
    const now = new Date().toISOString();
    
    return {
      id: options?.id || uuidv4(),
      name,
      description: options?.description || '',
      type: options?.type || 'standard', // Always use 'standard' as default
      status: options?.status || 'todo',
      priority: options?.priority || 'medium',
      dueDate: options?.dueDate,
      createdAt: options?.createdAt || now,
      updatedAt: options?.updatedAt || now,
      completed: options?.completed || false,
      tags: options?.tags || [],
      duration: options?.duration || 1500, // Default 25 minutes
      metrics: options?.metrics || {},
      timeEstimate: options?.timeEstimate,
      relationships: options?.relationships || {},
      ...options
    };
  },
  
  /**
   * Creates a timer task
   */
  createTimerTask: (
    name: string,
    durationMinutes: number = 25,
    options?: Partial<Task>
  ): Task => {
    return taskFactory.createTask(name, {
      type: 'timer',
      duration: durationMinutes * 60,
      ...options
    });
  },
  
  /**
   * Creates a checklist task
   */
  createChecklistTask: (
    name: string,
    items: { text: string; completed: boolean }[] = [],
    options?: Partial<Task>
  ): Task => {
    return taskFactory.createTask(name, {
      type: 'checklist',
      checklistItems: items.map(item => ({
        id: uuidv4(),
        ...item
      })),
      ...options
    });
  },
  
  /**
   * Creates a journal task
   */
  createJournalTask: (
    name: string,
    entry: string = '',
    options?: Partial<Task>
  ): Task => {
    return taskFactory.createTask(name, {
      type: 'journal',
      description: entry,
      ...options
    });
  },
  
  /**
   * Creates a habit task
   */
  createHabitTask: (
    name: string,
    habitId: string,
    date: string = new Date().toISOString().split('T')[0],
    options?: Partial<Task>
  ): Task => {
    return taskFactory.createTask(name, {
      type: 'habit',
      id: `habit-${habitId}-${date}`,
      relationships: {
        habitId,
        date,
        ...(options?.relationships || {})
      },
      ...options
    });
  },
  
  /**
   * Creates a clone of an existing task
   */
  cloneTask: (
    sourceTask: Task,
    overrides?: Partial<Task>
  ): Task => {
    const { id, completedAt, ...taskData } = sourceTask;
    
    return {
      ...taskData,
      id: uuidv4(),
      name: `${taskData.name} (Copy)`,
      createdAt: new Date().toISOString(),
      completed: false,
      ...overrides
    };
  }
};
