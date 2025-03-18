
import React from 'react';
import { Clock, Timer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { useTimerModal } from '@/hooks/timer/useTimerModal';

export const EmptyTimerState = () => {
  const taskContext = useTaskContext();
  const { openTimerModal } = useTimerModal();
  
  const handleStartInstantTimer = () => {
    openTimerModal();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="mb-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Timer className="h-10 w-10 text-primary/70" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Start a Focus Session</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-4">
          <button 
            onClick={handleStartInstantTimer}
            className="text-primary hover:underline focus:outline-none"
          >
            Create an instant timer
          </button> or select a task from the list below.
        </p>
      </div>
      
      <Button 
        onClick={handleStartInstantTimer}
        className="gap-2 w-full max-w-md"
        size="lg"
      >
        Start Instant Timer
      </Button>
    </div>
  );
};
