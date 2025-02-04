import { memo, useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "@/hooks/useWindowSize";

interface TimerConfettiProps {
  show: boolean;
}

export const TimerConfetti = memo(({ show }: TimerConfettiProps) => {
  const { width, height } = useWindowSize();
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Auto-hide confetti after animation
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      <ReactConfetti
        width={width}
        height={height}
        gravity={0.12}
        numberOfPieces={400}
        recycle={false}
        colors={["#7C3AED", "#8B5CF6", "#A78BFA", "#C4B5FD", "#EDE9FE"]}
        tweenDuration={5000}
        wind={0.01}
        initialVelocityY={-2}
      />
    </div>
  );
});

TimerConfetti.displayName = 'TimerConfetti';