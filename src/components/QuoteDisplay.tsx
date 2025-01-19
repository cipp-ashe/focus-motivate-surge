import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Small progress is still progress.", author: "Unknown" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" }
];

export const QuoteDisplay = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote>(quotes[0]);
  const [isLiked, setIsLiked] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const getRandomQuote = () => {
    const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setIsFlipped(true);
    setTimeout(() => {
      setCurrentQuote(newQuote);
      setIsLiked(false);
      setIsFlipped(false);
    }, 300);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast("Quote added to favorites!");
    }
  };

  return (
    <div className="quote-container">
      <Card className={`quote-card p-6 bg-white/80 backdrop-blur-sm ${isFlipped ? 'flipped' : ''}`}>
        <div className="text-center space-y-4">
          <p className="text-lg font-medium italic text-primary">"{currentQuote.text}"</p>
          <p className="text-sm text-muted-foreground">— {currentQuote.author}</p>
          <div className="flex justify-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`transition-colors ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-500'}`}
            >
              <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={getRandomQuote}
              className="text-gray-400 hover:text-gray-500"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};