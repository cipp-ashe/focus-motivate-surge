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
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
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
  { text: "Logic will get you from A to B. Imagination will take you everywhere.", author: "Albert Einstein" },
  { text: "The cave you fear to enter holds the treasure you seek.", author: "Joseph Campbell" },
  { text: "Life is not a matter of holding good cards, but of playing a poor hand well.", author: "Robert Louis Stevenson" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Have no fear of perfection - you'll never reach it.", author: "Salvador Dalí" },
];

export const QuoteDisplay = ({ favorites, setFavorites }: QuoteDisplayProps) => {
  const [currentQuote, setCurrentQuote] = useState<Quote>(quotes[0]);
  const [isLiked, setIsLiked] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [quotePool, setQuotePool] = useState<Quote[]>([...quotes]);

  useEffect(() => {
    const interval = setInterval(() => {
      getRandomQuote();
    }, 15000);

    return () => clearInterval(interval);
  }, [quotePool]);

  useEffect(() => {
    setIsLiked(favorites.some(fav => fav.text === currentQuote.text));
  }, [currentQuote, favorites]);

  const shuffleQuotes = (quotes: Quote[]) => {
    return [...quotes].sort(() => Math.random() - 0.5);
  };

  const getRandomQuote = () => {
    if (quotePool.length === 0) {
      setQuotePool(shuffleQuotes(quotes));
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
    if (!isLiked) {
      setFavorites(prev => [...prev, currentQuote]);
      toast("Quote added to favorites! ✨");
    } else {
      setFavorites(prev => prev.filter(quote => quote.text !== currentQuote.text));
    }
    setIsLiked(!isLiked);
  };

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

export const FavoriteQuotes = ({ favorites }: { favorites: Quote[] }) => {
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
