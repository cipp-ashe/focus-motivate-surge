export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Tag extends BaseEntity {
  name: string;
  color: TagColor;
}

export type TagColor = 'default' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';

export interface TagRelation extends BaseEntity {
  tagId: string;
  entityId: string;
  entityType: EntityType;
}

export interface EntityRelation extends BaseEntity {
  sourceId: string;
  sourceType: EntityType;
  targetId: string;
  targetType: EntityType;
  relationType: RelationType;
}

export interface TaggableEntity extends BaseEntity {
  tags?: Tag[];
}

export type EntityType = 'note' | 'task' | 'habit';
export type RelationType = 'habit-task' | 'task-note' | 'habit-note' | 'habit-journal';

// Schema version for managing migrations
export const SCHEMA_VERSION = '1.0.0';

// Initialize database structure
export const initializeDataStore = () => {
  console.log('Initializing data store with schema version:', SCHEMA_VERSION);
  
  try {
    // Initialize core data structures if they don't exist
    if (!localStorage.getItem('schema-version')) {
      localStorage.setItem('schema-version', SCHEMA_VERSION);
      localStorage.setItem('entity-relations', JSON.stringify([]));
      localStorage.setItem('tag-relations', JSON.stringify([]));
      console.log('Data store initialized successfully');
    }
    return true;
  } catch (error) {
    console.error('Failed to initialize data store:', error);
    return false;
  }
};
