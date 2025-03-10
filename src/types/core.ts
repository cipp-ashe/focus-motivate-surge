
export enum EntityType {
  Task = 'task',
  Habit = 'habit',
  Note = 'note',
  Template = 'template',
  Tag = 'tag',
  VoiceNote = 'voicenote'
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
