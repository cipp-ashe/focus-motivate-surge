
import { Task } from '@/types/tasks';

// Define the storage key for task relationships
const TASK_RELATIONSHIPS_KEY = 'task-relationships';

// Define the relationship type
interface TaskRelationship {
  taskId: string;
  entityId: string;
  entityType: string;
  relationshipType: string;
  metadata?: Record<string, any>;
}

// Export the task relationship storage module
export const taskRelationshipStorage = {
  // Get all relationships for a task
  getTaskRelationships: (taskId: string): TaskRelationship[] => {
    try {
      const relationshipsJson = localStorage.getItem(TASK_RELATIONSHIPS_KEY);
      if (!relationshipsJson) return [];
      
      const relationships: TaskRelationship[] = JSON.parse(relationshipsJson);
      return relationships.filter(rel => rel.taskId === taskId);
    } catch (error) {
      console.error('Error fetching task relationships:', error);
      return [];
    }
  },
  
  // Add a relationship for a task
  addTaskRelationship: (relationship: TaskRelationship): boolean => {
    try {
      const relationshipsJson = localStorage.getItem(TASK_RELATIONSHIPS_KEY);
      const relationships: TaskRelationship[] = relationshipsJson ? JSON.parse(relationshipsJson) : [];
      
      // Check if relationship already exists
      const exists = relationships.some(
        rel => rel.taskId === relationship.taskId && 
               rel.entityId === relationship.entityId &&
               rel.relationshipType === relationship.relationshipType
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
  
  // Remove a relationship
  removeTaskRelationship: (taskId: string, entityId: string, relationshipType?: string): boolean => {
    try {
      const relationshipsJson = localStorage.getItem(TASK_RELATIONSHIPS_KEY);
      if (!relationshipsJson) return false;
      
      let relationships: TaskRelationship[] = JSON.parse(relationshipsJson);
      
      // Filter out the relationship(s) to remove
      relationships = relationships.filter(rel => {
        if (rel.taskId !== taskId || rel.entityId !== entityId) return true;
        if (relationshipType && rel.relationshipType !== relationshipType) return true;
        return false;
      });
      
      localStorage.setItem(TASK_RELATIONSHIPS_KEY, JSON.stringify(relationships));
      return true;
    } catch (error) {
      console.error('Error removing task relationship:', error);
      return false;
    }
  },
  
  // Get all tasks related to an entity
  getRelatedTasks: (entityId: string, entityType?: string): Task[] => {
    try {
      // This function would ideally load tasks from task storage
      // But to avoid circular imports, we'll just return the task IDs
      const relationshipsJson = localStorage.getItem(TASK_RELATIONSHIPS_KEY);
      if (!relationshipsJson) return [];
      
      const relationships: TaskRelationship[] = JSON.parse(relationshipsJson);
      return relationships
        .filter(rel => rel.entityId === entityId && (!entityType || rel.entityType === entityType))
        .map(rel => ({ id: rel.taskId } as Task)); // Return minimal task objects
    } catch (error) {
      console.error('Error fetching related tasks:', error);
      return [];
    }
  },
  
  // Clear all relationships for testing
  _clearAllRelationships: (): void => {
    localStorage.removeItem(TASK_RELATIONSHIPS_KEY);
  }
};
