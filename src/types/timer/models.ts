
export type QuoteCategory = 'motivation' | 'productivity' | 'focus' | 'success' | 'wisdom' | 'general';

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
