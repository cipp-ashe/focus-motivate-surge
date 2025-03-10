
export enum EntityType {
  Task = 'task',
  Habit = 'habit',
  Note = 'note',
  Template = 'template',
  Tag = 'tag',
  VoiceNote = 'voicenote',
  Quote = 'quote'
}

export interface Relationship {
  id: string;
  entityId: string;
  entityType: EntityType;
  relatedEntityId: string;
  relatedEntityType: EntityType;
  relationshipType?: string;
  metadata?: Record<string, any>;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TagRelation {
  id: string;
  tagId: string;
  entityId: string;
  entityType: EntityType;
  createdAt: string;
  updatedAt?: string;
}

// Add the initializeDataStore function
export const initializeDataStore = (): boolean => {
  try {
    // Set schema version
    localStorage.setItem('schema-version', '1.0');
    
    // Initialize entity relations if not exists
    if (!localStorage.getItem('entity-relations')) {
      localStorage.setItem('entity-relations', JSON.stringify([]));
    }
    
    // Initialize tag relations if not exists
    if (!localStorage.getItem('tag-relations')) {
      localStorage.setItem('tag-relations', JSON.stringify([]));
    }
    
    return true;
  } catch (error) {
    console.error('Failed to initialize data store:', error);
    return false;
  }
};
