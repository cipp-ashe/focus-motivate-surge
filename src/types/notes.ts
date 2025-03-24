
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

// Relationship metadata for associating notes with other entities
export interface Relationship {
  entityId: string;
  entityType: EntityType;
  metadata?: {
    templateId?: string;
    date?: string;
    metricType?: string;
    taskId?: string; // Added support for task relationships
    habitId?: string; // Added support for habit relationships
    [key: string]: any;
  };
}

// Define the Note type
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  relationships?: Relationship[];
}

// Helper function to validate tag colors
export function isValidTagColor(color: string): boolean {
  return [
    'default', 'red', 'green', 'blue', 'yellow', 
    'purple', 'pink', 'orange', 'teal', 'cyan', 
    'indigo', 'gray'
  ].includes(color);
}

// Create a standard function to create a new note
export function createNote(
  title: string, 
  content: string, 
  tags: Tag[] = [],
  relationships?: Relationship[]
): Omit<Note, 'id'> {
  const now = new Date().toISOString();
  return {
    title,
    content,
    createdAt: now,
    updatedAt: now,
    tags,
    relationships
  };
}
