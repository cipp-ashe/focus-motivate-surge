
/**
 * Quote Types
 * 
 * Types for quotes used in the journal and task components
 */

export type QuoteCategory = 
  | 'motivation'
  | 'growth'
  | 'habits'
  | 'success'
  | 'persistence'
  | 'passion'
  | 'productivity';

export interface Quote {
  id: string;
  text: string;
  author: string;
  isFavorite: boolean;
  category: QuoteCategory | QuoteCategory[];
}
