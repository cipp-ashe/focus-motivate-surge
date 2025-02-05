import { Card } from "../ui/card";
import { Button } from "../ui/button";
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
    nextQuote,
    isLiked,
    isFading,
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
    <div className="w-full">
      <Card className="quote-card p-6 bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg min-h-[220px] flex flex-col justify-between">
        <div className="text-center space-y-2">
          <div className="flex justify-center items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <div className="flex gap-1">
              {currentQuote.categories.map((category, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                  title={`This quote is about ${category}`}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          <div className="relative min-h-[120px] flex flex-col items-center justify-center">
            <div className="quote-content-wrapper">
              {/* Current Quote */}
              <div className={`transition-opacity duration-2000 ease-in-out ${
                isFading ? 'opacity-0' : 'opacity-100'
              }`}>
                <p className="text-base font-medium italic bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 break-words mb-3">
                  "{currentQuote.text}"
                </p>
                <p className="text-sm text-muted-foreground">— {currentQuote.author}</p>
                {currentTask && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Showing quotes relevant to: {currentTask}
                  </p>
                )}
              </div>
              
              {/* Next Quote (pre-loaded) */}
              {nextQuote && (
                <div className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
                  isFading ? 'opacity-100' : 'opacity-0'
                }`}>
                  <p className="text-base font-medium italic bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 break-words mb-3">
                    "{nextQuote.text}"
                  </p>
                  <p className="text-sm text-muted-foreground">— {nextQuote.author}</p>
                  {currentTask && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Showing quotes relevant to: {currentTask}
                    </p>
                  )}
                </div>
              )}
            </div>
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
