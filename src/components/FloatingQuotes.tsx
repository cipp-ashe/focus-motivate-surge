import { memo } from "react";
import { Quote } from "../types/timer";

interface FloatingQuotesProps {
  favorites: Quote[];
}

export const FloatingQuotes = memo(({ favorites }: FloatingQuotesProps) => {
  if (!favorites.length) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {favorites.map((quote, index) => (
        <div
          key={index}
          className={`
            absolute text-primary/10 font-medium text-lg whitespace-nowrap
            animate-float-${index % 3} // Three different float animations
          `}
          style={{
            // Distribute quotes across the screen
            left: `${(index * 25) % 75}%`,
            top: `${(index * 30) % 70}%`,
            // Alternate between left and right for natural distribution
            transform: `translateX(${index % 2 ? "-25%" : "0"})`,
          }}
        >
          {quote.text}
        </div>
      ))}
    </div>
  );
});

FloatingQuotes.displayName = "FloatingQuotes";