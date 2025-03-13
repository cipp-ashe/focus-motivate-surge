
import React from 'react';

export const EmptyTimerState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">No Task Selected</h2>
      <p className="text-muted-foreground mb-4">
        Select a task from the list to start the timer.
      </p>
    </div>
  );
};
