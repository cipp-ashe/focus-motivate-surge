import { memo, useEffect, useRef, useState } from "react";
import { Quote } from "../types/timer";
import { Card } from "./ui/card";

interface FloatingQuotesProps {
  favorites: Quote[];
}

interface QuotePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

// Simple velocity parameters
const VELOCITY = 0.15; // Constant velocity for smooth motion

export const FloatingQuotes = memo(({ favorites }: FloatingQuotesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<QuotePosition[]>([]);
  const animationFrameRef = useRef<number>();

  // Initialize random positions and directions
  useEffect(() => {
    if (!favorites.length) return;
    
    const newPositions = favorites.map(() => {
      // Random initial position
      const x = Math.random() * 80 + 10; // 10-90%
      const y = Math.random() * 80 + 10; // 10-90%
      
      // Random direction with constant velocity
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
      setPositions(prevPositions => {
        return prevPositions.map(pos => {
          let { x, y, vx, vy } = pos;
          
          // Update position
          x += vx;
          y += vy;

          // Simple edge bouncing
          if (x < 0 || x > 100) {
            vx = -vx;
            x = x < 0 ? 0 : 100;
          }
          if (y < 0 || y > 100) {
            vy = -vy;
            y = y < 0 ? 0 : 100;
          }

          return { x, y, vx, vy };
        });
      });

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
          <Card
            key={index}
            className="
              absolute p-4 max-w-[300px] 
              bg-card/90 backdrop-blur-sm 
              shadow-[0_0_15px_rgba(var(--primary),0.2)]
              border border-primary/30
              hover:shadow-[0_0_25px_rgba(var(--primary),0.3)]
            "
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)',
              transition: 'box-shadow 0.3s ease-in-out'
            }}
          >
            <div className="text-primary font-medium">
              {quote.text}
            </div>
            <div className="text-primary/60 text-sm mt-1 text-right">
              - {quote.author}
            </div>
          </Card>
        );
      })}
    </div>
  );
});

FloatingQuotes.displayName = "FloatingQuotes";