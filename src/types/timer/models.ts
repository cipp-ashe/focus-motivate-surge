export type QuoteCategory = 
  | 'motivation'
  | 'focus'
  | 'progress'
  | 'productivity'
  | 'persistence'
  | 'success';

export interface Quote {
  text: string;
  author: string;
  categories: QuoteCategory[];
}