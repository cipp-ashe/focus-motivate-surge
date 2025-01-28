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
  { text: "The world needs people who see things differently.", author: "Unknown" },
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
  { text: "Never do anything by halves.", author: "Roald Dahl" },
  { text: "Finish each day and be done with it.", author: "Ralph Waldo Emerson" },
  { text: "Impossible is just a big word.", author: "Muhammad Ali" },
  { text: "Never stop fighting.", author: "E.E. Cummings" },
  { text: "You must not be defeated.", author: "Maya Angelou" },
  { text: "If it's not OK, it's not the end.", author: "John Lennon" },
  { text: "It's not that I'm so smart, it's just that I stay with problems longer.", author: "Albert Einstein" },
  { text: "There are no great limits to growth because there are no limits of human intelligence, imagination, and wonder.", author: "Ronald Reagan" },
  { text: "It's not that I'm so smart, it's just that I stay with problems longer.", author: "Albert Einstein" },
  { text: "The key to success is not in changing the direction of the wind, but in knowing how to set your sails.", author: "Unknown" },
  { text: "ADHD is not a deficit of attention, but a wandering of attention to the most interesting nearby stimulus.", author: "Unknown" },
  { text: "Your ADHD brain may not follow the usual path, but it can lead you to remarkable places.", author: "Unknown" },
  { text: "Success with ADHD is not about overcoming the condition, but about finding strategies that work for you.", author: "Unknown" },
  { text: "Your ADHD brain may process social cues differently, and that's okay. You bring unique energy and creativity to relationships.", author: "Unknown" },
  { text: "Having ADHD doesn't mean you're a bad friend. You might show care differently, which makes your friendships special.", author: "Unknown" },
  { text: "Impulsivity can lead to surprises, and with a pause, those surprises can turn into opportunities.", author: "Unknown" },
  { text: "Managing ADHD isn't about controlling everything. It's about understanding when to act and when to pause.", author: "Unknown" },
  { text: "You don't have to see the whole staircase. Just take the first step.", author: "Martin Luther King Jr." },
  { text: "Every small task you complete is a victory. Your path doesn't have to look like everyone else's.", author: "Unknown" },
  { text: "Sometimes, irritability is just your brain asking for a break. Step away, take a breath, and come back with a clearer mind.", author: "Unknown" },
  { text: "Having strong emotions means you feel deeply — and that can be a strength when you learn to channel it.", author: "Unknown" }
];

const QuoteDisplay = ({ favorites, setFavorites }: QuoteDisplayProps) => {
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
      setQuotePool(shuffleQuotes(quotes)); // Refill and shuffle when pool is empty
    }

    const newQuote = quotePool[0]; // Select the first quote from the pool
    setQuotePool(prev => prev.slice(1)); // Remove the used quote
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
