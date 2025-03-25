
import React from 'react';
import { Card } from '@/components/ui/card';
import { TimerSection } from '@/components/timer/TimerSection';
import { TaskSelectionProvider } from '@/components/timer/providers/TaskSelectionProvider';

export const TimerView = () => {
  return (
    <TaskSelectionProvider>
      <Card className="shadow-md border-border/20 overflow-hidden dark:bg-card/80">
        <TimerSection favorites={[]} setFavorites={() => {}} />
      </Card>
    </TaskSelectionProvider>
  );
};

TimerView.displayName = 'TimerView';
