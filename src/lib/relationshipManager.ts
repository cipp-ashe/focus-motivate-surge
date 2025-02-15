
import { eventBus } from './eventBus';
import type { EntityType, EntityRelationship, RelationType } from '@/types/state';

class RelationshipManager {
  private static instance: RelationshipManager;
  private relationships: EntityRelationship[];
  private relationshipsByType: Map<RelationType, EntityRelationship[]>;

  private constructor() {
    this.relationships = [];
    this.relationshipsByType = new Map();
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
    eventBus.on('relationship:batch-update', this.batchUpdateRelationships.bind(this));
    
    // Handle tag relationships
    eventBus.on('tag:link', (tagId, entityId, entityType) => {
      this.createRelationship(tagId, 'tag', entityId, entityType, 'tag-entity');
    });
    
    eventBus.on('tag:unlink', (tagId, entityId) => {
      this.deleteRelationship(tagId, entityId);
    });
    
    // Handle quote relationships
    eventBus.on('quote:link-task', (quoteId, taskId) => {
      this.createRelationship(quoteId, 'quote', taskId, 'task', 'quote-task');
    });
    
    // Handle habit template relationships
    eventBus.on('habit:template-update', (templateId, habitId) => {
      this.createRelationship(templateId, 'template', habitId, 'habit', 'template-habit');
    });
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
    
    // Update typed relationships
    const typeRelationships = this.relationshipsByType.get(relationType) || [];
    typeRelationships.push(relationship);
    this.relationshipsByType.set(relationType, typeRelationships);
    
    console.log('Created relationship:', relationship);
    return relationship;
  }

  deleteRelationship(sourceId: string, targetId: string) {
    const removedRelationships = this.relationships.filter(
      r => r.sourceId === sourceId && r.targetId === targetId
    );
    
    this.relationships = this.relationships.filter(
      r => !(r.sourceId === sourceId && r.targetId === targetId)
    );
    
    // Update typed relationships
    removedRelationships.forEach(rel => {
      const typeRelationships = this.relationshipsByType.get(rel.relationType) || [];
      this.relationshipsByType.set(
        rel.relationType,
        typeRelationships.filter(r => 
          !(r.sourceId === sourceId && r.targetId === targetId)
        )
      );
    });
    
    console.log('Deleted relationship between', sourceId, 'and', targetId);
  }

  updateRelationship(
    sourceId: string,
    targetId: string,
    updates: Partial<EntityRelationship>
  ) {
    this.relationships = this.relationships.map(r => {
      if (r.sourceId === sourceId && r.targetId === targetId) {
        const updated = { ...r, ...updates };
        
        // Update typed relationships if type changed
        if (updates.relationType && updates.relationType !== r.relationType) {
          const oldTypeRels = this.relationshipsByType.get(r.relationType) || [];
          const newTypeRels = this.relationshipsByType.get(updates.relationType) || [];
          
          this.relationshipsByType.set(
            r.relationType,
            oldTypeRels.filter(rel => 
              !(rel.sourceId === sourceId && rel.targetId === targetId)
            )
          );
          
          this.relationshipsByType.set(
            updates.relationType,
            [...newTypeRels, updated]
          );
        }
        
        return updated;
      }
      return r;
    });
  }

  batchUpdateRelationships(updates: {
    sourceId: string;
    targetId: string;
    updates: Partial<EntityRelationship>;
  }[]) {
    updates.forEach(update => {
      this.updateRelationship(update.sourceId, update.targetId, update.updates);
    });
  }

  getRelationships(entityId: string, entityType: EntityType) {
    return this.relationships.filter(
      r => 
        (r.sourceId === entityId && r.sourceType === entityType) ||
        (r.targetId === entityId && r.targetType === entityType)
    );
  }

  getRelationshipsByType(relationType: RelationType) {
    return this.relationshipsByType.get(relationType) || [];
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

  clear() {
    this.relationships = [];
    this.relationshipsByType.clear();
  }
}

export const relationshipManager = RelationshipManager.getInstance();

