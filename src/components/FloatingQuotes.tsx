import { memo, useEffect, useRef, useState } from "react";
import { Quote } from "../types/timer";

interface FloatingQuotesProps {
  favorites: Quote[];
}

interface QuotePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

// Slightly increased velocity for better visibility
const VELOCITY = 0.08;

export const FloatingQuotes = memo(({ favorites }: FloatingQuotesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<QuotePosition[]>([]);
  const animationFrameRef = useRef<number>();

  // Initialize random positions and directions
  useEffect(() => {
    if (!favorites.length) return;

    const newPositions = favorites.map(() => {
      const x = Math.random() * 80 + 10;
      const y = Math.random() * 80 + 10;
      const angle = Math.random() * Math.PI * 2;
      const vx = Math.cos(angle) * VELOCITY;
      const vy = Math.sin(angle) * VELOCITY;
      return { x, y, vx, vy };
    });

    setPositions(newPositions);
  }, [favorites.length]);

  // Animation loop
  useEffect(() => {
    if (!positions.length || !containerRef.current) return;

    const animate = () => {
      setPositions(prevPositions =>
        prevPositions.map(pos => {
          let { x, y, vx, vy } = pos;

          x += vx;
          y += vy;

          if (x < 0 || x > 100) {
            vx = -vx;
            x = x < 0 ? 0 : 100;
          }
          if (y < 0 || y > 100) {
            vy = -vy;
            y = y < 0 ? 0 : 100;
          }

          return { x, y, vx, vy };
        })
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [positions.length]);

  if (!favorites.length) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {favorites.map((quote, index) => {
        const position = positions[index];
        if (!position) return null;

        return (
          <div
            key={index}
            className="absolute text-primary/50 backdrop-blur-md"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: "translate(-50%, -50%)",
              maxWidth: "300px", // Enforce max width for wrapping
              textAlign: "center", // Center the text within the block
            }}
          >
            <div className="text-lg font-light italic leading-relaxed">
              "{quote.text}"
            </div>
            <div className="text-sm text-primary/40 mt-1">— {quote.author}</div>
          </div>
        );
      })}
    </div>
  );
});

FloatingQuotes.displayName = "FloatingQuotes";
