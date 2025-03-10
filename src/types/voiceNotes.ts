
import { EntityType } from '@/types/core';

export interface VoiceNote {
  id: string;
  text: string;
  timestamp: number;
  isComplete: boolean;
  audioUrl?: string;
  duration?: number;
  transcriptionStatus?: 'pending' | 'completed' | 'failed';
}

export interface VoiceNoteRelationship {
  entityId: string;
  entityType: EntityType;
}

export interface VoiceNoteContextType {
  notes: VoiceNote[];
  addNote: (text: string, audioUrl?: string, duration?: number) => void;
  deleteNote: (id: string) => void;
  toggleNoteComplete: (id: string) => void;
  updateNoteText: (id: string, text: string) => void;
  createNoteFromVoiceNote?: (voiceNoteId: string) => void;
}
