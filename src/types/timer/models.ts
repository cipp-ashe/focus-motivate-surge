export type QuoteCategory = 
  | 'motivation'
  | 'focus'
  | 'progress'
  | 'productivity'
  | 'persistence'
  | 'success'
  | 'growth'
  | 'creativity'
  | 'learning';

export interface Quote {
  text: string;
  author: string;
  categories: QuoteCategory[];
}