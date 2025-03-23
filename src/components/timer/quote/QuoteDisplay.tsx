
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, RefreshCw } from "lucide-react";
import { Quote } from "@/types/timer/models";

interface QuoteDisplayProps {
  quote: Quote | null;
  onNewQuote: () => void;
  onAddToFavorites: (quote: Quote) => void;
  onRemoveFromFavorites: (quoteId: string) => void;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({
  quote,
  onNewQuote,
  onAddToFavorites,
  onRemoveFromFavorites
}) => {
  if (!quote) {
    return null;
  }

  const handleToggleFavorite = () => {
    if (quote.isFavorite) {
      onRemoveFromFavorites(quote.id);
    } else {
      onAddToFavorites({...quote, isFavorite: true});
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="text-center">
        <blockquote className="text-sm italic text-foreground/80 mb-2">
          "{quote.text}"
        </blockquote>
        <p className="text-xs text-foreground/60 font-medium">— {quote.author}</p>
      </div>
      
      <div className="flex justify-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleToggleFavorite}
          aria-label={quote.isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            className={`h-4 w-4 ${quote.isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} 
          />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onNewQuote}
          aria-label="Get new quote"
        >
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
};
