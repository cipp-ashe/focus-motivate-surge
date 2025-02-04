import React from 'react';
import { type TaskMetrics } from '@/types/metrics';

interface CompletionCelebrationProps {
  show: boolean;
  onClose: () => void;
  taskName: string;
  metrics: TaskMetrics;
  width?: number;
  height?: number;
}

export const CompletionCelebration: React.FC<CompletionCelebrationProps> = ({
  show,
  onClose,
  taskName,
  metrics,
  width = window.innerWidth,
  height = window.innerHeight,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-primary">Task Completed! 🎉</h2>
          <p className="text-lg mb-6">{taskName}</p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted p-3 rounded">
                <p className="text-sm text-muted-foreground">Expected Time</p>
                <p className="font-medium">{Math.floor(metrics.expectedTime / 60)} min</p>
              </div>
              <div className="bg-muted p-3 rounded">
                <p className="text-sm text-muted-foreground">Actual Duration</p>
                <p className="font-medium">{Math.floor(metrics.actualDuration / 60)} min</p>
              </div>
              <div className="bg-muted p-3 rounded">
                <p className="text-sm text-muted-foreground">Efficiency</p>
                <p className="font-medium">{metrics.efficiencyRatio}%</p>
              </div>
              <div className="bg-muted p-3 rounded">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{metrics.completionStatus}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pauses</span>
                <span>{metrics.pauseCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Paused Time</span>
                <span>{Math.floor(metrics.pausedTime / 60)} min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Net Effective Time</span>
                <span>{Math.floor(metrics.netEffectiveTime / 60)} min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Quotes Favorited</span>
                <span>{metrics.favoriteQuotes}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
