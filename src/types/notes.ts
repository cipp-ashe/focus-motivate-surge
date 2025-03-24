/**
 * Note Types
 */

// Note type
export type NoteType = 'text' | 'journal' | 'habit-journal' | 'voice' | 'task-journal';

// Tag color
export type TagColor =
  | 'default'
  | 'red'
  | 'green'
  | 'blue'
  | 'purple'
  | 'yellow'
  | 'orange'
  | 'cyan'
  | 'pink';

// Note tag
export interface NoteTag {
  name: string;
  color: TagColor;
}

// Relationship type
export interface Relationship {
  entityId: string;
  entityType: 'task' | 'habit' | 'note';
  metadata?: Record<string, any>;
}

// Note interface
export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  createdAt: string;
  updatedAt: string;
  tags: NoteTag[];
  favorite?: boolean;
  relatedEntityId?: string;
  relatedEntityType?: 'task' | 'habit';
  voiceNoteUrl?: string;
  transcription?: string;
  relationships?: Relationship[];
}

// Storage key for notes
export const STORAGE_KEY = 'notes';

// Tag type
export interface Tag {
  id: string;
  name: string;
  color?: string;
  description?: string;
}

// Helper function to create a new note
export const createNote = (
  title: string,
  content: string,
  type: NoteType = 'text',
  tags: NoteTag[] = []
): Omit<Note, 'id'> => {
  const now = new Date().toISOString();
  return {
    title,
    content,
    type,
    tags,
    createdAt: now,
    updatedAt: now,
  };
};

// Helper function to create a voice note
export const createVoiceNote = (
  title: string,
  voiceNoteUrl: string,
  duration: number,
  transcription: string = '',
  tags: NoteTag[] = []
): Omit<Note, 'id'> => {
  return {
    title,
    content:
      transcription ||
      `Voice note recorded on ${new Date().toLocaleString()}. Duration: ${duration}s`,
    type: 'voice',
    tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    voiceNoteUrl,
    transcription,
  };
};
