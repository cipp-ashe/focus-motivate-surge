
// Types for quotes used in the timer
export type QuoteCategory = 'motivation' | 'focus' | 'productivity' | 'success' | 'general' | 
  'creativity' | 'learning' | 'persistence' | 'growth' | 'gratitude' | 'mindfulness' | 'reflection';

export interface Quote {
  id?: string;
  text: string;
  author: string;
  category: QuoteCategory[];
  isFavorite?: boolean;
  // Additional properties used in the app
  task?: string;
  timestamp?: string;
}
