import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, RefreshCw, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface Quote {
  text: string;
  author: string;
}

interface QuoteDisplayProps {
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
}

const quotes: Quote[] = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Small progress is still progress.", author: "Unknown" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
  { text: "Everything you can imagine is real.", author: "Pablo Picasso" },
  { text: "Make each day your masterpiece.", author: "John Wooden" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "What makes you different is what makes you powerful.", author: "Unknown" },
  { text: "Logic will get you from A to B. Imagination will take you everywhere.", author: "Albert Einstein" },
  { text: "The cave you fear to enter holds the treasure you seek.", author: "Joseph Campbell" },
  { text: "Life is not a matter of holding good cards, but of playing a poor hand well.", author: "Robert Louis Stevenson" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The important thing is not to stop questioning. Curiosity has its own reason for existing.", author: "Albert Einstein" },
  { text: "The ability to simplify means to eliminate the unnecessary so that the necessary may speak.", author: "Hans Hofmann" },
  { text: "Have no fear of perfection - you'll never reach it.", author: "Salvador Dalí" },
  { text: "If I have seen further than others, it is by standing upon the shoulders of giants.", author: "Isaac Newton" },
  { text: "The secret of change is to focus all your energy, not on fighting the old, but on building the new.", author: "Socrates" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "Go confidently in the direction of your dreams. Live the life you have imagined.", author: "Henry David Thoreau" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
  { text: "Knowing is not enough; we must apply. Willing is not enough; we must do.", author: "Johann Wolfgang von Goethe" },
  { text: "Try not to become a person of success, but rather try to become a person of value.", author: "Albert Einstein" },
  { text: "Resilience is not about bouncing back, but about growing stronger after each challenge.", author: "Unknown" },
  { text: "Every question you ask opens a door to new possibilities.", author: "Unknown" },
  { text: "The world needs people who see things differently.", author: "Unknown" },
  { text: "Innovation is seeing what everyone sees but thinking what no one has thought.", author: "Unknown" },
  { text: "Change begins where comfort ends.", author: "Unknown" },
  { text: "Curiosity is the compass that leads us to the undiscovered.", author: "Unknown" },
  { text: "The best way to solve a problem is to understand it completely.", author: "Unknown" },
  { text: "Purpose is not something you find; it’s something you create through your actions.", author: "Unknown" },
  { text: "Vision without strategy is a dream; vision with execution is a legacy.", author: "Unknown" }
];

export const QuoteDisplay = ({ favorites = [], setFavorites }: QuoteDisplayProps) => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [quotePool, setQuotePool] = useState<Quote[]>([...quotes]);

  useEffect(() => {
    if (quotePool.length > 0 && !currentQuote) {
      setCurrentQuote(quotePool[0]);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getRandomQuote();
    }, 15000);

    return () => clearInterval(interval);
  }, [quotePool]);

  useEffect(() => {
    if (currentQuote) {
      setIsLiked(favorites.some(fav => fav.text === currentQuote.text));
    }
  }, [currentQuote, favorites]);

  const shuffleQuotes = (quotes: Quote[]) => {
    return [...quotes].sort(() => Math.random() - 0.5);
  };

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
      setFavorites(prev => [...prev, currentQuote]);
      toast("Quote added to favorites! ✨");
    } else {
      setFavorites(prev => prev.filter(quote => quote.text !== currentQuote.text));
    }
    setIsLiked(!isLiked);
  };

  if (!currentQuote) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card 
        className={`quote-card p-6 bg-card/80 backdrop-blur-sm border-primary/20 transition-all duration-300 ${
          isFlipped ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <div className="text-center space-y-4">
          <Sparkles className="h-6 w-6 mx-auto text-primary" />
          <p className="text-xl font-medium italic bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            "{currentQuote.text}"
          </p>
          <p className="text-sm text-muted-foreground">— {currentQuote.author}</p>
          <div className="flex justify-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`transition-all duration-300 hover:scale-105 ${
                isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={getRandomQuote}
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export interface FavoriteQuotesProps {
  favorites: Quote[];
}

export const FavoriteQuotes = ({ favorites }: FavoriteQuotesProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const quotesPerPage = 6;

  const totalPages = Math.ceil(favorites.length / quotesPerPage);
  const paginatedFavorites = favorites.slice(
    currentPage * quotesPerPage,
    (currentPage + 1) * quotesPerPage
  );

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  if (favorites.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-primary">Favorite Quotes</h3>
      <div className="grid gap-3 grid-cols-2">
        {paginatedFavorites.map((quote, index) => (
          <Card 
            key={index}
            className="p-3 bg-card/60 backdrop-blur-sm border-primary/20 transform transition-all duration-300 hover:scale-102 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          >
            <p className="text-sm italic">{quote.text}</p>
            <p className="text-xs text-muted-foreground mt-1">— {quote.author}</p>
          </Card>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={currentPage === 0}
            className="border-primary/20"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground py-2">
            {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className="border-primary/20"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};