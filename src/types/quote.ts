
/**
 * Quote Types
 * 
 * Types for quotes used in the journal and task components
 */

// Quote categories - unified definition to prevent duplication
export type QuoteCategory = 
  | 'motivation'
  | 'growth'
  | 'habits'
  | 'success'
  | 'persistence'
  | 'passion'
  | 'productivity'
  | 'focus'
  | 'wisdom'
  | 'general'
  | 'creativity'
  | 'learning'
  | 'gratitude'
  | 'reflection'
  | 'mindfulness';

// Quote interface - unified definition to prevent duplication
export interface Quote {
  id: string;
  text: string;
  author: string;
  isFavorite: boolean;
  category: QuoteCategory | QuoteCategory[];
  task?: string;
  timestamp?: string;
}
