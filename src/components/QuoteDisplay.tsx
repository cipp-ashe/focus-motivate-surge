import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, RefreshCw, Sparkles } from "lucide-react";
import { Quote } from "@/types/timer";
import { useQuoteManager } from "@/hooks/useQuoteManager";

interface QuoteDisplayProps {
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
  onLike?: () => void;
  currentTask?: string;
  showAsOverlay?: boolean;
}

export const QuoteDisplay = ({
  favorites,
  setFavorites,
  onLike,
  currentTask}: QuoteDisplayProps) => {
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
      <Card className="quote-card p-6 bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg min-h-[200px] flex flex-col justify-between">
        <div className="text-center space-y-4">
          <Sparkles className="h-5 w-5 mx-auto text-primary" />
          <div
            className={`transition-all duration-300 ${
              isFlipped ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'
            }`}
          >
            <p className="text-base font-medium italic bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 break-words mb-3">
              "{currentQuote.text}"
            </p>
            <p className="text-sm text-muted-foreground">— {currentQuote.author}</p>
          </div>
          <div className="flex justify-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                handleLike();
                if (!isLiked) onLike?.();
              }}
              className={`transition-all duration-300 hover:scale-105 hover:bg-transparent ${
                isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={getRandomQuote}
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 hover:bg-transparent"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export { FavoriteQuotes } from './FavoriteQuotes';