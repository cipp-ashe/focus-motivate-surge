
import React, { useState } from 'react';
import { TimerMetrics } from '@/types/metrics';
import { Button } from '@/components/ui/button';

interface TimerProps {
  taskId: string;
  onComplete: (taskId: string, metrics?: TimerMetrics) => void;
}

export const Timer: React.FC<TimerProps> = ({ taskId, onComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  
  const handleComplete = () => {
    setIsRunning(false);
    onComplete(taskId);
  };
  
  // Basic timer implementation
  return (
    <div>
      <Button 
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        onClick={handleComplete}
      >
        Complete Task
      </Button>
    </div>
  );
};
