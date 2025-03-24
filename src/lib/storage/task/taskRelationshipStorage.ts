
import { Task } from '@/types/tasks';
import { activeTasksStorage } from './activeTasksStorage';
import { completedTasksStorage } from './completedTasksStorage';

/**
 * Task relationship storage interface
 */
export interface TaskRelationship {
  taskId: string;
  entityId: string;
  entityType?: string;
  relationshipType?: string;
}

// Key for relationship storage
const TASK_RELATIONSHIPS_KEY = 'task-relationships';

/**
 * Task Relationship Storage Module
 * 
 * Manages relationships between tasks and other entities like habits, templates, etc.
 */
export const taskRelationshipStorage = {
  /**
   * Get all relationships for a specific task
   */
  getTaskRelationships(taskId: string): TaskRelationship[] {
    try {
      const relationshipsStr = localStorage.getItem(TASK_RELATIONSHIPS_KEY);
      if (!relationshipsStr) return [];
      
      const relationships: TaskRelationship[] = JSON.parse(relationshipsStr);
      return relationships.filter(r => r.taskId === taskId);
    } catch (error) {
      console.error('Error getting task relationships:', error);
      return [];
    }
  },
  
  /**
   * Add a relationship between a task and another entity
   */
  addTaskRelationship(relationship: TaskRelationship): boolean {
    try {
      const relationshipsStr = localStorage.getItem(TASK_RELATIONSHIPS_KEY);
      const relationships: TaskRelationship[] = relationshipsStr ? JSON.parse(relationshipsStr) : [];
      
      // Check if relationship already exists
      const exists = relationships.some(r => 
        r.taskId === relationship.taskId && 
        r.entityId === relationship.entityId &&
        r.relationshipType === relationship.relationshipType
      );
      
      if (!exists) {
        relationships.push(relationship);
        localStorage.setItem(TASK_RELATIONSHIPS_KEY, JSON.stringify(relationships));
      }
      
      return true;
    } catch (error) {
      console.error('Error adding task relationship:', error);
      return false;
    }
  },
  
  /**
   * Remove a relationship between a task and another entity
   */
  removeTaskRelationship(taskId: string, entityId: string, relationshipType?: string): boolean {
    try {
      const relationshipsStr = localStorage.getItem(TASK_RELATIONSHIPS_KEY);
      if (!relationshipsStr) return false;
      
      const relationships: TaskRelationship[] = JSON.parse(relationshipsStr);
      
      const filteredRelationships = relationships.filter(r => {
        if (relationshipType) {
          return !(r.taskId === taskId && r.entityId === entityId && r.relationshipType === relationshipType);
        }
        return !(r.taskId === taskId && r.entityId === entityId);
      });
      
      localStorage.setItem(TASK_RELATIONSHIPS_KEY, JSON.stringify(filteredRelationships));
      
      return true;
    } catch (error) {
      console.error('Error removing task relationship:', error);
      return false;
    }
  },
  
  /**
   * Get all tasks related to a specific entity
   */
  getRelatedTasks(entityId: string, entityType?: string): Task[] {
    try {
      const relationshipsStr = localStorage.getItem(TASK_RELATIONSHIPS_KEY);
      if (!relationshipsStr) return [];
      
      const relationships: TaskRelationship[] = JSON.parse(relationshipsStr);
      
      // Filter relationships matching the entity
      const matchingRelationships = relationships.filter(r => {
        if (entityType) {
          return r.entityId === entityId && r.entityType === entityType;
        }
        return r.entityId === entityId;
      });
      
      // Get task IDs from relationships
      const taskIds = matchingRelationships.map(r => r.taskId);
      
      // Get active and completed tasks
      const activeTasks = activeTasksStorage.loadTasks();
      const completedTasks = completedTasksStorage.loadCompletedTasks();
      
      // Filter tasks by IDs
      const relatedTasks = [...activeTasks, ...completedTasks].filter(task => 
        taskIds.includes(task.id)
      );
      
      return relatedTasks;
    } catch (error) {
      console.error('Error getting related tasks:', error);
      return [];
    }
  },
  
  /**
   * Delete all tasks related to a template
   */
  deleteTasksByTemplate(templateId: string): boolean {
    try {
      // Get all tasks related to the template
      const relatedTasks = this.getRelatedTasks(templateId, 'template');
      
      // Delete each task
      relatedTasks.forEach(task => {
        // Active tasks
        activeTasksStorage.removeTask(task.id);
        
        // Completed tasks (if any)
        completedTasksStorage.removeCompletedTask(task.id);
      });
      
      // Clean up relationships
      const relationshipsStr = localStorage.getItem(TASK_RELATIONSHIPS_KEY);
      if (relationshipsStr) {
        const relationships: TaskRelationship[] = JSON.parse(relationshipsStr);
        
        // Filter out relationships for this template
        const updatedRelationships = relationships.filter(r => 
          !(r.entityId === templateId && r.entityType === 'template')
        );
        
        localStorage.setItem(TASK_RELATIONSHIPS_KEY, JSON.stringify(updatedRelationships));
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting tasks by template:', error);
      return false;
    }
  },
  
  /**
   * Clear all relationships (used for testing/debugging)
   */
  _clearAllRelationships(): boolean {
    try {
      localStorage.removeItem(TASK_RELATIONSHIPS_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing relationships:', error);
      return false;
    }
  }
};
