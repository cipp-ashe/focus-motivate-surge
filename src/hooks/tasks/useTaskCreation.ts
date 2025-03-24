
/**
 * Unified Task Creation Hook
 * 
 * This hook provides a standardized way to create different types of tasks,
 * with proper integration with other systems like notes and habits.
 */

import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskType } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';

export const useTaskCreation = () => {
  /**
   * Create a standard task
   */
  const createTask = useCallback((
    name: string,
    description: string = '',
    taskType: TaskType = 'regular',
    duration: number = 0,
    options: {
      suppressToast?: boolean;
      selectAfterCreate?: boolean;
      tags?: string[];
    } = {}
  ) => {
    const taskId = uuidv4();
    const now = new Date().toISOString();
    
    const task: Task = {
      id: taskId,
      name,
      description,
      taskType,
      status: 'pending',
      completed: false,
      duration,
      createdAt: now,
      tags: options.tags || []
    };
    
    // Emit event to create task
    eventManager.emit('task:create', task);
    
    // Select task if requested
    if (options.selectAfterCreate) {
      eventManager.emit('task:select', taskId);
    }
    
    // Show toast unless suppressed
    if (!options.suppressToast) {
      toast.success(`Created ${taskType} task: ${name}`);
    }
    
    return taskId;
  }, []);
  
  /**
   * Create a journal task linked to a note
   */
  const createJournalTask = useCallback((
    name: string,
    description: string = '',
    noteId?: string,
    options: {
      suppressToast?: boolean;
      selectAfterCreate?: boolean;
      habitId?: string;
      templateId?: string;
      date?: string;
    } = {}
  ) => {
    const taskId = uuidv4();
    const now = new Date().toISOString();
    
    const task: Task = {
      id: taskId,
      name,
      description,
      taskType: 'journal',
      status: 'pending',
      completed: false,
      duration: 0,
      createdAt: now,
      relationships: {
        noteId,
        habitId: options.habitId,
        templateId: options.templateId,
        date: options.date || now
      },
      tags: ['journal']
    };
    
    // Emit event to create task
    eventManager.emit('task:create', task);
    
    // Select task if requested
    if (options.selectAfterCreate) {
      eventManager.emit('task:select', taskId);
    }
    
    // Show toast unless suppressed
    if (!options.suppressToast) {
      toast.success(`Created journal task: ${name}`);
    }
    
    return taskId;
  }, []);
  
  /**
   * Create a timer task
   */
  const createTimerTask = useCallback((
    name: string,
    duration: number = 1500, // 25 minutes by default
    description: string = '',
    options: {
      suppressToast?: boolean;
      selectAfterCreate?: boolean;
      habitId?: string;
      templateId?: string;
    } = {}
  ) => {
    const taskId = uuidv4();
    const now = new Date().toISOString();
    
    const task: Task = {
      id: taskId,
      name,
      description,
      taskType: 'timer',
      status: 'pending',
      completed: false,
      duration,
      createdAt: now,
      relationships: {
        habitId: options.habitId,
        templateId: options.templateId
      },
      tags: ['timer'],
      metrics: {
        expectedTime: duration
      }
    };
    
    // Emit event to create task
    eventManager.emit('task:create', task);
    
    // Select task if requested
    if (options.selectAfterCreate) {
      eventManager.emit('task:select', taskId);
    }
    
    // Show toast unless suppressed
    if (!options.suppressToast) {
      toast.success(`Created timer task: ${name}`);
    }
    
    return taskId;
  }, []);
  
  /**
   * Create a screenshot task
   */
  const createScreenshotTask = useCallback((
    name: string,
    imageUrl: string,
    fileName: string = '',
    capturedText: string = '',
    options: {
      suppressToast?: boolean;
      selectAfterCreate?: boolean;
    } = {}
  ) => {
    const taskId = uuidv4();
    const now = new Date().toISOString();
    
    const task: Task = {
      id: taskId,
      name,
      description: capturedText,
      taskType: 'screenshot',
      status: 'pending',
      completed: false,
      createdAt: now,
      imageUrl,
      fileName,
      capturedText,
      imageType: 'screenshot',
      tags: ['screenshot']
    };
    
    // Emit event to create task
    eventManager.emit('task:create', task);
    
    // Select task if requested
    if (options.selectAfterCreate) {
      eventManager.emit('task:select', taskId);
    }
    
    // Show toast unless suppressed
    if (!options.suppressToast) {
      toast.success(`Created screenshot: ${name}`);
    }
    
    return taskId;
  }, []);
  
  /**
   * Create a voice note task that links to a note
   */
  const createVoiceNoteTask = useCallback((
    name: string,
    audioUrl: string,
    audioDuration: number,
    audioText: string = '',
    noteId?: string,
    options: {
      suppressToast?: boolean;
      selectAfterCreate?: boolean;
    } = {}
  ) => {
    const taskId = uuidv4();
    const now = new Date().toISOString();
    
    const task: Task = {
      id: taskId,
      name,
      description: audioText,
      taskType: 'voicenote',
      status: 'pending',
      completed: false,
      createdAt: now,
      audioUrl,
      audioText,
      audioDuration,
      relationships: {
        noteId
      },
      tags: ['voicenote']
    };
    
    // Emit event to create task
    eventManager.emit('task:create', task);
    
    // Select task if requested
    if (options.selectAfterCreate) {
      eventManager.emit('task:select', taskId);
    }
    
    // Show toast unless suppressed
    if (!options.suppressToast) {
      toast.success(`Created voice note: ${name}`);
    }
    
    return taskId;
  }, []);
  
  /**
   * Create a checklist task
   */
  const createChecklistTask = useCallback((
    name: string,
    items: string[] = [],
    description: string = '',
    options: {
      suppressToast?: boolean;
      selectAfterCreate?: boolean;
    } = {}
  ) => {
    const taskId = uuidv4();
    const now = new Date().toISOString();
    
    const task: Task = {
      id: taskId,
      name,
      description,
      taskType: 'checklist',
      status: 'pending',
      completed: false,
      createdAt: now,
      tags: ['checklist'],
      checklistItems: items.map(text => ({
        id: uuidv4(),
        text,
        completed: false
      }))
    };
    
    // Emit event to create task
    eventManager.emit('task:create', task);
    
    // Select task if requested
    if (options.selectAfterCreate) {
      eventManager.emit('task:select', taskId);
    }
    
    // Show toast unless suppressed
    if (!options.suppressToast) {
      toast.success(`Created checklist: ${name}`);
    }
    
    return taskId;
  }, []);
  
  /**
   * Create a habit task based on habit configuration
   */
  const createHabitTask = useCallback((
    habitId: string,
    name: string,
    trackingType: TaskType = 'regular',
    templateId: string,
    date: string,
    options: {
      suppressToast?: boolean;
      selectAfterCreate?: boolean;
      duration?: number;
    } = {}
  ) => {
    const taskId = `habit-${habitId}-${date}`;
    const now = new Date().toISOString();
    
    // Determine appropriate task type from habit's tracking type
    let taskType: TaskType = trackingType;
    
    const task: Task = {
      id: taskId,
      name,
      description: `Habit task for ${date}`,
      taskType,
      status: 'pending',
      completed: false,
      duration: options.duration || 0,
      createdAt: now,
      relationships: {
        habitId,
        templateId,
        date
      },
      tags: ['habit']
    };
    
    // Emit event to create task
    eventManager.emit('task:create', task);
    
    // Select task if requested
    if (options.selectAfterCreate) {
      eventManager.emit('task:select', taskId);
    }
    
    // Show toast unless suppressed
    if (!options.suppressToast) {
      toast.success(`Created habit task: ${name}`);
    }
    
    return taskId;
  }, []);

  return {
    createTask,
    createJournalTask,
    createTimerTask,
    createScreenshotTask,
    createVoiceNoteTask,
    createChecklistTask,
    createHabitTask
  };
};
