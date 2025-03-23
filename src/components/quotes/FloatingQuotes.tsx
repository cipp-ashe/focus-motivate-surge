
import { memo, useState } from "react";
import { Quote } from "@/types/timer/models";

interface FloatingQuotesProps {
  favorites: Quote[];
}

export const FloatingQuotes = memo(({ favorites }: FloatingQuotesProps) => {
  const MAX_WIDTH = 300;

  if (!favorites.length) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {favorites.map((quote, index) => {
        // Position quotes in a static grid pattern
        const row = Math.floor(index / 2);
        const col = index % 2;
        const top = 20 + row * 25;
        const left = 25 + col * 50;

        return (
          <div
            key={quote.text}
            className="absolute"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              transform: `translate(-50%, -50%)`,
              maxWidth: `${MAX_WIDTH}px`,
              textAlign: "center",
              whiteSpace: "normal",
            }}
          >
            <div className="text-lg font-light italic text-primary leading-relaxed bg-background">
              "{quote.text}"
            </div>
            <div className="text-sm text-primary mt-1">
              — {quote.author}
            </div>
          </div>
        );
      })}
    </div>
  );
});

FloatingQuotes.displayName = "FloatingQuotes";
