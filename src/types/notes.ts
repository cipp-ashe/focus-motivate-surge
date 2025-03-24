
import { EntityType } from './core';

// Define allowed colors for tags
export type TagColor =
  | 'default'  // Added 'default' as a valid tag color
  | 'red'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'purple'
  | 'pink'
  | 'orange'
  | 'teal'
  | 'cyan'
  | 'indigo'
  | 'gray';

// Define the Tag type
export interface Tag {
  name: string;
  color: TagColor;
}

// Define the Note type
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  relationships?: {
    entityId: string;
    entityType: EntityType;
  }[];
}

// Helper function to validate tag colors
export function isValidTagColor(color: string): boolean {
  return [
    'default', 'red', 'green', 'blue', 'yellow', 
    'purple', 'pink', 'orange', 'teal', 'cyan', 
    'indigo', 'gray'
  ].includes(color);
}
