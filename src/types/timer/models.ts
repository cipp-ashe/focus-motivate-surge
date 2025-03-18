
// Types for quotes used in the timer
export type QuoteCategory = 'motivation' | 'focus' | 'productivity' | 'success' | 'general';

export interface Quote {
  id: string;
  text: string;
  author: string;
  category: QuoteCategory;
  isFavorite?: boolean;
}
