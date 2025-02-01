import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, RefreshCw, Sparkles } from "lucide-react";
import { Quote } from "@/types/timer";
import { useQuoteManager } from "@/hooks/useQuoteManager";

interface QuoteDisplayProps {
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
  currentTask?: string;
  showAsOverlay?: boolean;
}

export const QuoteDisplay = ({
  favorites,
  setFavorites,
  currentTask,
  showAsOverlay = false
}: QuoteDisplayProps) => {
  const {
    currentQuote,
    isLiked,
    isFlipped,
    handleLike,
    getRandomQuote,
  } = useQuoteManager({
    favorites,
    setFavorites,
    currentTask,
  });

  if (!currentQuote) {
    return null;
  }

  return (
    <div className="w-full transition-all duration-700">
      <Card className="quote-card p-8 bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg min-h-[240px] flex flex-col justify-between">
        <div className="text-center space-y-6">
          <Sparkles className="h-6 w-6 mx-auto text-primary" />
          <div
            className={`transition-all duration-300 ${
              isFlipped ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'
            }`}
          >
            <p className="text-lg font-medium italic bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 break-words mb-4">
              "{currentQuote.text}"
            </p>
            <p className="text-sm text-muted-foreground">— {currentQuote.author}</p>
          </div>
          <div className="flex justify-center gap-6 pt-4">
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

export { FavoriteQuotes } from './FavoriteQuotes';