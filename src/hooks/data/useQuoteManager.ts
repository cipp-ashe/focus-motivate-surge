
import { useState, useEffect, useCallback } from 'react';
import { quotes } from '@/data/quotes';
import { Quote, QuoteCategory } from '@/types/timer';

export const useQuoteManager = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [favoriteQuotes, setFavoriteQuotes] = useState<Quote[]>(() => {
    try {
      const saved = localStorage.getItem('favoriteQuotes');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading favorite quotes:', error);
      return [];
    }
  });

  // Get a random quote, optionally filtered by category
  const getRandomQuote = useCallback((category?: QuoteCategory) => {
    const filteredQuotes = category
      ? quotes.filter(quote => quote.category === category)
      : quotes;
    
    if (filteredQuotes.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    return filteredQuotes[randomIndex];
  }, []);

  // Refresh to a new random quote
  const refreshQuote = useCallback((category?: QuoteCategory) => {
    const newQuote = getRandomQuote(category);
    setCurrentQuote(newQuote);
    return newQuote;
  }, [getRandomQuote]);

  // Set initial quote
  useEffect(() => {
    if (!currentQuote) {
      refreshQuote();
    }
  }, [currentQuote, refreshQuote]);

  // Save favorite quotes to localStorage when they change
  useEffect(() => {
    localStorage.setItem('favoriteQuotes', JSON.stringify(favoriteQuotes));
  }, [favoriteQuotes]);

  // Toggle favorite status of a quote
  const toggleFavorite = useCallback((quote: Quote) => {
    setFavoriteQuotes(prev => {
      const isAlreadyFavorite = prev.some(q => q.id === quote.id);
      
      if (isAlreadyFavorite) {
        return prev.filter(q => q.id !== quote.id);
      } else {
        return [...prev, quote];
      }
    });
  }, []);

  // Check if a quote is favorited
  const isFavorite = useCallback((quoteId: string) => {
    return favoriteQuotes.some(q => q.id === quoteId);
  }, [favoriteQuotes]);

  return {
    currentQuote,
    favoriteQuotes,
    refreshQuote,
    toggleFavorite,
    isFavorite,
  };
};
