import { memo, useEffect, useRef, useState } from "react";
import { Quote } from "@/types/timer/models";

interface FloatingQuotesProps {
  favorites: Quote[];
}

interface QuotePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

// Adjusted velocity for more fluid motion
const VELOCITY = 0.08;
const MAX_WIDTH = 300; // Fixed max width for proper wrapping
const SAFE_MARGIN = (MAX_WIDTH / window.innerWidth) * 100; // Prevents text from hitting edges

export const FloatingQuotes = memo(({ favorites }: FloatingQuotesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<QuotePosition[]>([]);
  const animationFrameRef = useRef<number>();

  // Initialize random positions and directions
  useEffect(() => {
    if (!favorites.length) return;

    const newPositions = favorites.map(() => {
      const x = Math.random() * (90 - SAFE_MARGIN) + SAFE_MARGIN / 2;
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

          // Bounce logic considering max width to prevent weird wrapping
          if (x < SAFE_MARGIN || x > 100 - SAFE_MARGIN) {
            vx = -vx;
            x = x < SAFE_MARGIN ? SAFE_MARGIN : 100 - SAFE_MARGIN;
          }
          if (y < 10 || y > 90) {
            vy = -vy;
            y = y < 10 ? 10 : 90;
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
            className="absolute"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: "translate(-50%, -50%)",
              maxWidth: `${MAX_WIDTH}px`,
              textAlign: "center",
              whiteSpace: "normal", // Ensures proper wrapping
            }}
          >
            <div
              className="text-lg font-light italic text-primary/80 leading-relaxed"
              style={{
                textShadow: "1px 1px 5px rgba(0, 0, 0, 0.5)", // Ensures visibility on any background
              }}
            >
              "{quote.text}"
            </div>
            <div className="text-sm text-primary/60 mt-1">— {quote.author}</div>
          </div>
        );
      })}
    </div>
  );
});

FloatingQuotes.displayName = "FloatingQuotes";
