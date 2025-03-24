
import { Task, TaskType } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';

/**
 * Migrates any tasks with incorrect taskType values to the correct values
 * This is especially important for habit tasks that may have been created
 * with the non-standard "habit" type
 */
export const migrateTaskTypes = () => {
  console.log('Starting task type migration...');
  
  try {
    // Get all tasks from storage
    const allTasks = taskStorage.loadTasks();
    let migratedCount = 0;
    
    // Check each task for invalid task types
    allTasks.forEach(task => {
      // Skip if task has no type or a valid type
      if (!task.taskType || isValidTaskType(task.taskType)) return;
      
      // Determine the correct task type based on available information
      const newTaskType = determineTaskTypeFromTask(task);
      
      // Update the task with the new type
      task.taskType = newTaskType;
      taskStorage.updateTask(task.id, task);
      migratedCount++;
      
      console.log(`Migrated task ${task.id} (${task.name}) from invalid type to ${newTaskType}`);
    });
    
    console.log(`Task migration complete. Migrated ${migratedCount} tasks.`);
    return migratedCount;
  } catch (error) {
    console.error('Error during task type migration:', error);
    return 0;
  }
};

/**
 * Check if a taskType is valid according to the TaskType enum
 */
const isValidTaskType = (taskType: string): taskType is TaskType => {
  const validTypes: TaskType[] = [
    'timer', 'regular', 'screenshot', 'journal', 'checklist', 'voicenote', 'counter', 'rating'
  ];
  return validTypes.includes(taskType as TaskType);
};

/**
 * Determine the appropriate task type based on the task properties
 */
const determineTaskTypeFromTask = (task: Task): TaskType => {
  // Check for specific task properties that indicate a certain type
  if (task.checklistItems && task.checklistItems.length > 0) {
    return 'checklist';
  } else if (task.imageUrl || task.imageType) {
    return 'screenshot';
  } else if (task.voiceNoteUrl || task.voiceNoteText) {
    return 'voicenote';
  } else if (task.duration && task.duration > 0) {
    return 'timer';
  } else if (task.journalEntry) {
    return 'journal';
  } else if (task.rating !== undefined) {
    return 'rating';
  } else if (task.count !== undefined) {
    return 'counter';
  }
  
  // Check for metrics from habit system
  if (task.relationships?.metricType) {
    const metricType = task.relationships.metricType;
    if (metricType === 'timer') return 'timer';
    if (metricType === 'journal') return 'journal';
    if (metricType === 'counter') return 'counter';
    if (metricType === 'rating') return 'rating';
  }
  
  // Default to regular
  return 'regular';
};
