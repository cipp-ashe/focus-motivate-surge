
/**
 * Quote Hook
 * 
 * Provides a quote for use in journal entries and tasks
 */

import { useState, useEffect } from 'react';
import { Quote, QuoteCategory } from '@/types/quote';

// Default quotes
const DEFAULT_QUOTES: Quote[] = [
  {
    id: '1',
    text: 'The secret of getting ahead is getting started.',
    author: 'Mark Twain',
    isFavorite: false,
    category: 'motivation'
  },
  {
    id: '2',
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    isFavorite: false,
    category: 'passion'
  },
  {
    id: '3',
    text: 'Small steps lead to big changes.',
    author: 'Unknown',
    isFavorite: false,
    category: 'growth'
  },
  {
    id: '4',
    text: 'Consistency is the key to achieving and maintaining momentum.',
    author: 'Brian Tracy',
    isFavorite: false,
    category: 'habits'
  },
  {
    id: '5',
    text: 'Your habits determine your future.',
    author: 'Jack Canfield',
    isFavorite: false,
    category: 'habits'
  }
];

export function useQuote(category?: QuoteCategory | QuoteCategory[]) {
  const [quote, setQuote] = useState<Quote | null>(null);
  
  // Load a random quote
  useEffect(() => {
    let quotes = DEFAULT_QUOTES;
    
    // Filter by category if provided
    if (category) {
      quotes = quotes.filter(q => {
        if (Array.isArray(q.category)) {
          return Array.isArray(category) 
            ? q.category.some(c => category.includes(c))
            : q.category.includes(category);
        } else {
          return Array.isArray(category)
            ? category.includes(q.category as QuoteCategory)
            : q.category === category;
        }
      });
    }
    
    // Get a random quote
    if (quotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
    }
  }, [category]);
  
  return {
    quote,
    fetchQuote: () => {
      const randomIndex = Math.floor(Math.random() * DEFAULT_QUOTES.length);
      setQuote(DEFAULT_QUOTES[randomIndex]);
    }
  };
}

export default useQuote;
