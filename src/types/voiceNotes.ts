
/**
 * Voice Notes Types
 */

export interface VoiceNote {
  id: string;
  title: string;
  audioUrl: string;
  transcript?: string;
  createdAt: string;
  duration: number;
  text?: string;
}
