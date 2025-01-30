import { memo } from "react";
import { Quote } from "../types/timer";
import { Card } from "./ui/card";

interface FloatingQuotesProps {
  favorites: Quote[];
}

export const FloatingQuotes = memo(({ favorites }: FloatingQuotesProps) => {
  if (!favorites.length) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {favorites.map((quote, index) => (
        <Card
          key={index}
          className={`
            absolute p-4 shadow-lg max-w-[300px] 
            bg-card/90 backdrop-blur-sm border-primary/30
            animate-bounce-around-${(index % 3) + 1}
          `}
          style={{
            // Initial positions distributed around the edges
            left: `${[20, 60, 40][index % 3]}%`,
            top: `${[30, 20, 60][index % 3]}%`,
          }}
        >
          <div className="text-primary font-medium">
            {quote.text}
          </div>
          <div className="text-primary/60 text-sm mt-1 text-right">
            - {quote.author}
          </div>
        </Card>
      ))}
    </div>
  );
});

FloatingQuotes.displayName = "FloatingQuotes";