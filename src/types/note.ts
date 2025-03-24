
/**
 * Note Types
 */

// Note type
export type NoteType = 'text' | 'journal' | 'habit-journal' | 'voice' | 'task-journal';

// Tag color
export type TagColor = 'default' | 'red' | 'green' | 'blue' | 'purple' | 'yellow' | 'orange' | 'cyan' | 'pink';

// Note tag
export interface NoteTag {
  name: string;
  color: TagColor;
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
}

// Journal Entry extension
export interface JournalEntry extends Note {
  date: string;
  mood?: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  habitId?: string;
  taskId?: string;
  templateId?: string;
}
