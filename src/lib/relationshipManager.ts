
import { eventBus } from './eventBus';
import type { EntityType, EntityRelationship, RelationType } from '@/types/state';

class RelationshipManager {
  private static instance: RelationshipManager;
  private relationships: EntityRelationship[];

  private constructor() {
    this.relationships = [];
    this.setupEventListeners();
  }

  static getInstance(): RelationshipManager {
    if (!RelationshipManager.instance) {
      RelationshipManager.instance = new RelationshipManager();
    }
    return RelationshipManager.instance;
  }

  private setupEventListeners() {
    eventBus.on('relationship:create', this.createRelationship.bind(this));
    eventBus.on('relationship:delete', this.deleteRelationship.bind(this));
    eventBus.on('relationship:update', this.updateRelationship.bind(this));
  }

  createRelationship(
    sourceId: string,
    sourceType: EntityType,
    targetId: string,
    targetType: EntityType,
    relationType: RelationType
  ) {
    const relationship: EntityRelationship = {
      sourceId,
      sourceType,
      targetId,
      targetType,
      relationType,
    };

    this.relationships.push(relationship);
    console.log('Created relationship:', relationship);
    return relationship;
  }

  deleteRelationship(sourceId: string, targetId: string) {
    this.relationships = this.relationships.filter(
      r => !(r.sourceId === sourceId && r.targetId === targetId)
    );
    console.log('Deleted relationship between', sourceId, 'and', targetId);
  }

  updateRelationship(
    sourceId: string,
    targetId: string,
    updates: Partial<EntityRelationship>
  ) {
    this.relationships = this.relationships.map(r => {
      if (r.sourceId === sourceId && r.targetId === targetId) {
        return { ...r, ...updates };
      }
      return r;
    });
  }

  getRelationships(entityId: string, entityType: EntityType) {
    return this.relationships.filter(
      r => 
        (r.sourceId === entityId && r.sourceType === entityType) ||
        (r.targetId === entityId && r.targetType === entityType)
    );
  }

  getRelatedEntities(
    entityId: string,
    entityType: EntityType,
    relatedType?: EntityType
  ) {
    return this.relationships
      .filter(r => {
        const isSource = r.sourceId === entityId && r.sourceType === entityType;
        const isTarget = r.targetId === entityId && r.targetType === entityType;
        
        if (relatedType) {
          return (isSource && r.targetType === relatedType) ||
                 (isTarget && r.sourceType === relatedType);
        }
        
        return isSource || isTarget;
      })
      .map(r => {
        if (r.sourceId === entityId) {
          return { id: r.targetId, type: r.targetType };
        }
        return { id: r.sourceId, type: r.sourceType };
      });
  }
}

export const relationshipManager = RelationshipManager.getInstance();

// Example usage in a component:
/*
import { useEventBus } from './eventBus';
import { relationshipManager } from './relationshipManager';

const MyComponent = () => {
  useEventBus('task:complete', (taskId) => {
    const relatedNotes = relationshipManager.getRelatedEntities(taskId, 'task', 'note');
    // Handle related notes...
  });
  
  // Create a relationship
  const handleLinkNote = (taskId: string, noteId: string) => {
    eventBus.emit('relationship:create', taskId, 'task', noteId, 'note', 'task-note');
  };
};
*/
