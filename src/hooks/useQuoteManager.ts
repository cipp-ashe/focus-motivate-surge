import { useState, useEffect } from "react";
import { Quote } from "../types/timer";
import { toast } from "sonner";
import { quotes } from "../data/quotes";

interface UseQuoteManagerProps {
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
  currentTask?: string;
}

interface UseQuoteManagerReturn {
  currentQuote: Quote | null;
  isLiked: boolean;
  isFlipped: boolean;
  handleLike: () => void;
  getRandomQuote: () => void;
}

export const useQuoteManager = ({
  favorites,
  setFavorites,
  currentTask,
}: UseQuoteManagerProps): UseQuoteManagerReturn => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [quotePool, setQuotePool] = useState<Quote[]>([...quotes]);

  const shuffleQuotes = (quotesToShuffle: Quote[]) => {
    return [...quotesToShuffle].sort(() => Math.random() - 0.5);
  };

  // Initialize with a random quote
  useEffect(() => {
    if (!currentQuote) {
      const shuffledQuotes = shuffleQuotes(quotes);
      setQuotePool(shuffledQuotes.slice(1));
      setCurrentQuote(shuffledQuotes[0]);
    }
  }, []);

  // Auto-cycle quotes
  useEffect(() => {
    const interval = setInterval(() => {
      getRandomQuote();
    }, 15000);

    return () => clearInterval(interval);
  }, [quotePool]);

  // Update like status when quote or favorites change
  useEffect(() => {
    if (currentQuote) {
      setIsLiked(favorites.some(fav => fav.text === currentQuote.text));
    }
  }, [currentQuote, favorites]);

  const getRandomQuote = () => {
    if (quotePool.length === 0) {
      setQuotePool(shuffleQuotes(quotes));
      return;
    }

    const newQuote = quotePool[0];
    setQuotePool(prev => prev.slice(1));
    setIsFlipped(true);

    setTimeout(() => {
      setCurrentQuote(newQuote);
      setIsLiked(favorites.some(fav => fav.text === newQuote.text));
      setIsFlipped(false);
    }, 300);
  };

  const handleLike = () => {
    if (!currentQuote) return;

    if (!isLiked) {
      const now = new Date();
      const favoriteQuote = {
        ...currentQuote,
        timestamp: now.toLocaleString(),
        task: currentTask
      };
      setFavorites(prev => [...prev, favoriteQuote]);
      toast(`Quote added to favorites${currentTask ? ` while working on: ${currentTask}` : ''}! ✨`, {
        closeButton: true,
        duration: 4000
      });
    } else {
      setFavorites(prev => prev.filter(quote => quote.text !== currentQuote.text));
    }
    setIsLiked(!isLiked);
  };

  return {
    currentQuote,
    isLiked,
    isFlipped,
    handleLike,
    getRandomQuote,
  };
};