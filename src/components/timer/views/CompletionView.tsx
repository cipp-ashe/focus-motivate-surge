
import { TimerStateMetrics } from "@/types/metrics";
import { CompletionCelebration } from "../CompletionCelebration";

interface CompletionViewProps {
  metrics: TimerStateMetrics;
  onComplete: () => void;
}

export const CompletionView = ({ metrics, onComplete }: CompletionViewProps) => {
  return (
    <div className="animate-fade-in">
      <CompletionCelebration
        metrics={metrics}
        onComplete={onComplete}
      />
    </div>
  );
};
