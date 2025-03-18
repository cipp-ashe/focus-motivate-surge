
import React from 'react';
import { Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { useTimerModal } from '@/hooks/timer/useTimerModal';

export const EmptyTimerState = () => {
  const { openTimerModal } = useTimerModal();
  
  return (
    <div className="flex flex-col items-center justify-center h-full py-6 px-4">
      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-5">
        <Timer className="h-8 w-8 text-primary" />
      </div>
      
      <h2 className="text-xl font-semibold mb-2">Start a Focus Session</h2>
      
      <p className="text-muted-foreground text-center mb-6">
        <button 
          onClick={openTimerModal}
          className="text-primary hover:underline focus:outline-none"
        >
          Create an instant timer
        </button> 
        {' '}or select a task below
      </p>
      
      <Button 
        onClick={openTimerModal}
        variant="default"
        className="gap-2 px-8"
        size="lg"
      >
        Start Timer
      </Button>
    </div>
  );
};
