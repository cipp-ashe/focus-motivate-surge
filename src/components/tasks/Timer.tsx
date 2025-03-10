
import React from 'react';
import { TimerMetrics } from '@/types/metrics';

interface TimerProps {
  taskId: string;
  onComplete: (taskId: string, metrics?: TimerMetrics) => void;
}

export const Timer: React.FC<TimerProps> = ({ taskId, onComplete }) => {
  // Basic timer implementation
  return (
    <div>
      <button 
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        onClick={() => onComplete(taskId)}
      >
        Complete Task
      </button>
    </div>
  );
};
