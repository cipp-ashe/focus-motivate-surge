import { TimerStateMetrics } from "@/types/metrics";

export interface CompletionCelebrationProps {
  metrics: TimerStateMetrics;
  taskName: string;
  onClose: () => void;
  width: number;
  height: number;
  show: boolean;
}

const CompletionCelebration: React.FC<CompletionCelebrationProps> = ({
  metrics,
  taskName,
  onClose,
  width,
  height,
  show,
}) => {
  if (!show) return null;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 className="text-lg font-bold">Congratulations!</h2>
      <p>You have completed the task: {taskName}</p>
      <h3 className="text-md font-medium">Metrics</h3>
      <p>Expected Time: {metrics.expectedTime} mins</p>
      <p>Actual Duration: {metrics.actualDuration} mins</p>
      <p>Efficiency Ratio: {metrics.efficiencyRatio}%</p>
      <button onClick={onClose} className="mt-4 bg-blue-500 text-white rounded px-4 py-2">
        Close
      </button>
    </div>
  );
};

export { CompletionCelebration };
export default CompletionCelebration;