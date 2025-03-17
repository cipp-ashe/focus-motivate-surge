
import React from 'react';
import { Quote } from '@/types/timer';
import { Star } from 'lucide-react';

export interface QuoteDisplayProps {
  // Original props
  text?: string;
  author?: string;
  compact?: boolean;
  
  // Additional props used in other components
  currentTask?: string;
  onLike?: () => void;
  favorites?: Quote[];
  setFavorites?: React.Dispatch<React.SetStateAction<Quote[]>>;
  showAsOverlay?: boolean;
  showRandomQuotes?: boolean;
  
  // For backward compatibility
  quote?: { text: string; author: string };
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({
  text,
  author = '',
  compact = false,
  currentTask,
  onLike,
  favorites = [],
  setFavorites,
  showAsOverlay = false,
  showRandomQuotes = false,
  quote
}) => {
  // Handle both direct text/author and quote object
  const quoteText = text || (quote?.text || '');
  const quoteAuthor = author || (quote?.author || '');
  
  // Enhanced implementation that supports both compact display and interactive mode
  if (currentTask && (onLike || favorites)) {
    // This is the interactive quotes display with favorites functionality
    // Just provide a basic implementation for compatibility
    return (
      <div className={`quote-container ${showAsOverlay ? 'overlay' : ''}`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Inspirational Quote</h3>
          {onLike && (
            <button onClick={onLike} className="text-amber-500 hover:text-amber-600">
              <Star className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="text-sm italic">{quoteText || "Focus on what matters most."}</p>
        {quoteAuthor && <p className="text-xs text-muted-foreground mt-1">— {quoteAuthor}</p>}
      </div>
    );
  }
  
  // Original basic display implementation
  return (
    <div className={`quote-display ${compact ? 'quote-compact' : ''}`}>
      <p className="text-sm italic">{quoteText}</p>
      {quoteAuthor && <p className="text-xs text-muted-foreground mt-1">— {quoteAuthor}</p>}
    </div>
  );
};
