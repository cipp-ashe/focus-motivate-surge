
// Re-export all task operations from their modules to maintain the existing API
import { createTaskOperations } from './create';
import { updateTaskOperations } from './update';
import { deleteTaskOperations } from './delete';
import { completeTaskOperations } from './complete';
import { habitTaskOperations } from './habit';

// Combine all operations into a single export
export const taskOperations = {
  // Create operations
  createTask: createTaskOperations.createTask,
  createFromCompleted: createTaskOperations.createFromCompleted,
  
  // Update operations
  updateTask: updateTaskOperations.updateTask,
  
  // Delete operations
  deleteTask: deleteTaskOperations.deleteTask,
  
  // Complete operations
  completeTask: completeTaskOperations.completeTask,
  
  // Habit-specific operations
  createHabitTask: habitTaskOperations.createHabitTask
};
