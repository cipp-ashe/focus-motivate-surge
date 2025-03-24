
/**
 * Unified Notes Type System
 * 
 * This module defines all note-related types, including support for
 * different note formats like text and audio.
 */

import { EntityType } from '../core';

// Define allowed colors for tags
export type TagColor =
  | 'default'
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
    taskId?: string;
    habitId?: string;
    [key: string]: any;
  };
}

// Note content types
export type NoteContentType = 'text' | 'audio' | 'mixed';

// Audio metadata for voice notes
export interface AudioMetadata {
  url: string;
  duration: number;
  transcript?: string;
  recordedAt: string;
}

// Define the unified Note type
export interface Note {
  id: string;
  title: string;
  content: string;
  contentType: NoteContentType;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  relationships?: Relationship[];
  
  // Audio properties for voice notes
  audio?: AudioMetadata;
}

// Helper function to validate tag colors
export function isValidTagColor(color: string): boolean {
  return [
    'default', 'red', 'green', 'blue', 'yellow', 
    'purple', 'pink', 'orange', 'teal', 'cyan', 
    'indigo', 'gray'
  ].includes(color);
}

// Create a standard function to create a new text note
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
    contentType: 'text',
    createdAt: now,
    updatedAt: now,
    tags,
    relationships
  };
}

// Create a standard function to create a new voice note
export function createVoiceNote(
  title: string,
  audioUrl: string,
  audioDuration: number,
  transcript: string = '',
  tags: Tag[] = [],
  relationships?: Relationship[]
): Omit<Note, 'id'> {
  const now = new Date().toISOString();
  return {
    title,
    content: transcript, // Use transcript as content
    contentType: 'audio',
    createdAt: now,
    updatedAt: now,
    tags: [...tags, { name: 'voice-note', color: 'red' }],
    relationships,
    audio: {
      url: audioUrl,
      duration: audioDuration,
      transcript,
      recordedAt: now
    }
  };
}
