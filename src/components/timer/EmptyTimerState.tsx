
import React from 'react';
import { Clock, Play, Timer } from 'lucide-react';
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
          Create an instant timer or select a task from the list on the right.
        </p>
      </div>
      
      <Card className="bg-card border-primary/10 w-full max-w-md">
        <CardContent className="p-6">
          <Button 
            onClick={handleStartInstantTimer}
            className="w-full gap-2"
            size="lg"
          >
            <Play className="h-4 w-4" />
            Start Instant Timer
          </Button>
          
          <div className="text-center text-sm text-muted-foreground mt-4">
            <p>Or select a timer task from the list on the right →</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
