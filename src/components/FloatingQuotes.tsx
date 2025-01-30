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
  rotation: number;
  rotationVelocity: number;
  scale: number;
}

// Physics parameters
const DAMPENING = 0.98; // Energy loss on collisions
const ROTATION_DAMPENING = 0.95;
const MIN_VELOCITY = 0.15;
const MAX_VELOCITY = 0.4;
const TIMER_REPULSION = 0.8; // How strongly quotes are pushed away from timer
const EDGE_BOUNCE = 0.7; // How bouncy the edges are

export const FloatingQuotes = memo(({ favorites }: FloatingQuotesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<QuotePosition[]>([]);
  const animationFrameRef = useRef<number>();

  // Initialize random positions and velocities
  useEffect(() => {
    if (!favorites.length) return;
    
    const newPositions = favorites.map(() => ({
      x: Math.random() * 80 + 10, // 10-90%
      y: Math.random() * 80 + 10, // 10-90%
      vx: (Math.random() - 0.5) * MAX_VELOCITY,
      vy: (Math.random() - 0.5) * MAX_VELOCITY,
      rotation: Math.random() * 360,
      rotationVelocity: (Math.random() - 0.5),
      scale: 0.8 + Math.random() * 0.4
    }));
    
    setPositions(newPositions);
  }, [favorites.length]);

  // Animation loop
  useEffect(() => {
    if (!positions.length || !containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const timerCenter = {
      x: containerRect.width / 2,
      y: containerRect.height / 2
    };
    const timerRadius = Math.min(containerRect.width, containerRect.height) * 0.25; // Timer safe zone

    const animate = () => {
      setPositions(prevPositions => {
        return prevPositions.map(pos => {
          const { scale } = pos;
          let { x, y, vx, vy, rotation, rotationVelocity } = pos;
          
          // Update position
          x += vx;
          y += vy;

          // Bounce off edges
          if (x < 0 || x > 100) {
            vx = -vx * EDGE_BOUNCE;
            x = x < 0 ? 0 : 100;
            rotationVelocity = (Math.random() - 0.5) * 0.5;
          }
          if (y < 0 || y > 100) {
            vy = -vy * EDGE_BOUNCE;
            y = y < 0 ? 0 : 100;
            rotationVelocity = (Math.random() - 0.5) * 0.5;
          }

          // Avoid timer area with smooth repulsion
          const dx = (x / 100 * containerRect.width) - timerCenter.x;
          const dy = (y / 100 * containerRect.height) - timerCenter.y;
          const distanceToTimer = Math.sqrt(dx * dx + dy * dy);
          
          if (distanceToTimer < timerRadius) {
            const angle = Math.atan2(dy, dx);
            const pushForce = (timerRadius - distanceToTimer) / timerRadius;
            vx += Math.cos(angle) * pushForce * TIMER_REPULSION;
            vy += Math.sin(angle) * pushForce * TIMER_REPULSION;
            rotationVelocity += (Math.random() - 0.5) * 0.2;
          }

          // Update rotation with smooth deceleration
          rotation += rotationVelocity;
          rotationVelocity *= ROTATION_DAMPENING;

          // Apply minimum velocity for constant motion
          const speed = Math.sqrt(vx * vx + vy * vy);
          if (speed < MIN_VELOCITY) {
            const angle = Math.random() * Math.PI * 2;
            vx = Math.cos(angle) * MIN_VELOCITY;
            vy = Math.sin(angle) * MIN_VELOCITY;
          }

          // Limit maximum velocity
          if (speed > MAX_VELOCITY) {
            const factor = MAX_VELOCITY / speed;
            vx *= factor;
            vy *= factor;
          }

          // Apply velocity dampening
          vx *= DAMPENING;
          vy *= DAMPENING;

          return { x, y, vx, vy, rotation, rotationVelocity, scale };
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
              transform: `translate(-50%, -50%) scale(${position.scale}) rotate(${position.rotation}deg)`,
              transition: 'transform 0.1s ease-out, box-shadow 0.3s ease-in-out'
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