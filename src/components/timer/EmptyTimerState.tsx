
import React from 'react';
import { Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTimerModal } from '@/hooks/timer/useTimerModal';

export const EmptyTimerState = () => {
  const { openTimerModal } = useTimerModal();
  
  return (
    <div className="flex flex-col items-center justify-center h-full py-5 px-4">
      <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-4">
        <Timer className="h-7 w-7 text-primary" />
      </div>
      
      <h2 className="text-xl font-semibold mb-1">Start a Focus Session</h2>
      
      <p className="text-muted-foreground text-center mb-5">
        Click below to set your timer or select a task
      </p>
      
      <Button 
        onClick={openTimerModal}
        variant="default"
        className="gap-2"
        size="lg"
      >
        New Timer
      </Button>
    </div>
  );
};
