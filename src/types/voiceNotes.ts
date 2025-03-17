
// Type definitions for voice notes

export interface VoiceNote {
  id: string;
  text: string;
  timestamp: number; // Changed from string to number
  audioUrl?: string;
  isComplete: boolean;
}

export interface VoiceNoteState {
  notes: VoiceNote[];
  isRecording: boolean;
}
