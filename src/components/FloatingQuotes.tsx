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
            absolute p-4 max-w-[300px]
            bg-card/90 backdrop-blur-sm
            shadow-[0_0_15px_rgba(var(--primary),0.2)]
            border border-primary/30
            hover:shadow-[0_0_25px_rgba(var(--primary),0.3)]
            transition-shadow duration-1000
            animate-${['float-left', 'float-right', 'float-top'][index % 3]}
          `}
          style={{
            // Position quotes in clear areas around the timer
            ...(index % 3 === 0 && { // Left side
              left: '5%',
              top: '40%',
            }),
            ...(index % 3 === 1 && { // Right side
              right: '5%',
              top: '40%',
            }),
            ...(index % 3 === 2 && { // Top
              left: '40%',
              top: '5%',
            })
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