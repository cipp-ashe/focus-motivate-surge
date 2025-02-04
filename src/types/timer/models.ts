export type QuoteCategory = 
  | 'focus'
  | 'motivation'
  | 'persistence'
  | 'progress'
  | 'productivity'
  | 'growth'
  | 'creativity'
  | 'learning';

export interface Quote {
  id: string;
  text: string;
  author: string;
  categories: QuoteCategory[];
  task?: string;
  timestamp?: Date;
}