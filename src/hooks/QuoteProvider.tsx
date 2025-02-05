import React, { createContext, useContext, useState, useCallback } from 'react';
import { quotes } from '@/data/quotes';

interface QuoteContextType {
  currentQuote: string;
  nextQuote: () => void;
}

export const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const nextQuote = useCallback(() => {
    setQuoteIndex((current) => (current + 1) % quotes.length);
  }, []);

  const value = {
    currentQuote: quotes[quoteIndex],
    nextQuote,
  };

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}
