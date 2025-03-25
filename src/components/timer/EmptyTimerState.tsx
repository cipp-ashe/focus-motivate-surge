import React from 'react';
import { Timer } from 'lucide-react';
import { useTimerModal } from '@/hooks/timer/useTimerModal';

export const EmptyTimerState = () => {
  const { openTimerModal } = useTimerModal();

  return (
    <div className="flex flex-col items-center justify-center h-full py-6">
      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
        <Timer className="h-5 w-5 text-primary" />
      </div>

      <h2 className="text-lg font-medium mb-2">Start a Focus Session</h2>

      <p className="text-muted-foreground text-center text-sm max-w-[250px]">
        <button
          onClick={openTimerModal}
          className="text-primary hover:underline focus:outline-none font-medium"
        >
          Create an instant timer
        </button>{' '}
        or select a task from the list
      </p>
    </div>
  );
};
