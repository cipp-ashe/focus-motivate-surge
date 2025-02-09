
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
  entityType: 'note' | 'task' | 'habit';
}

export interface TaggableEntity extends BaseEntity {
  tags?: Tag[];
}

export type EntityType = 'note' | 'task' | 'habit';
