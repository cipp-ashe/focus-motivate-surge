
export type QuoteCategory = 
  | 'motivation' 
  | 'focus' 
  | 'creativity' 
  | 'learning' 
  | 'persistence' 
  | 'growth'
  | 'gratitude'
  | 'mindfulness'
  | 'reflection';

export interface Quote {
  text: string;
  author: string;
  categories: QuoteCategory[];
  timestamp?: string;
  task?: string;
}
