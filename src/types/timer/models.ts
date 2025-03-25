
export type QuoteCategory = 
  | 'motivation' | 'productivity' | 'focus' | 'success' | 'wisdom' | 'general'
  | 'persistence' | 'growth' | 'creativity' | 'learning' | 'gratitude' 
  | 'reflection' | 'mindfulness';

export interface Quote {
  id: string;
  text: string;
  author: string;
  isFavorite: boolean;
  category?: QuoteCategory | QuoteCategory[];
  task?: string;
  timestamp?: string;
}

export type SoundOption = 'bell' | 'chime' | 'gong' | 'notification' | 'success' | 'none';

export type TaskType = 'timer' | 'focus' | 'standard' | 'journal' | 'habit' | 'recurring' | 'checklist' | 'project' | 'screenshot' | 'voicenote';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'canceled' | 'archived';
