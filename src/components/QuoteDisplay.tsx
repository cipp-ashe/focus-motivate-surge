import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, RefreshCw, Sparkles } from "lucide-react";
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
      toast("Quote added to favorites! ✨");
    }
  };

  return (
    <div className="quote-container">
      <Card 
        className={`quote-card p-6 bg-card/80 backdrop-blur-sm border-primary/20 ${
          isFlipped ? 'flipped' : ''
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
              className={`transition-all duration-300 hover:scale-110 ${
                isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={getRandomQuote}
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};