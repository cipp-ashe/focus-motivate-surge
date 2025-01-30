import { memo, useMemo } from "react";
import { Quote } from "../types/timer";
import { Card } from "./ui/card";

interface FloatingQuotesProps {
  favorites: Quote[];
}

export const FloatingQuotes = memo(({ favorites }: FloatingQuotesProps) => {
  const quotePositions = useMemo(() => 
    favorites.map(() => {
      const angle = Math.random() * Math.PI * 2;
      // Random distance from center (25-50% of container)
      const distance = 25 + Math.random() * 25;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      // Random size variation (0.7-1.1)
      const scale = 0.7 + Math.random() * 0.4;
      // Random rotation (-10 to 10 degrees)
      const rotation = -10 + Math.random() * 20;
      
      return {
        left: `calc(50% + ${x}%)`,
        top: `calc(50% + ${y}%)`,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
        animationDelay: `${Math.random() * -10}s`
      };
    })
  , [favorites.length]);

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
            animate-float-${(index % 6) + 1}
          `}
          style={quotePositions[index]}
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