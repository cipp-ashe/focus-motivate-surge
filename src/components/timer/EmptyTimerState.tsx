
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Timer, PlusCircle } from 'lucide-react';

export const EmptyTimerState: React.FC = () => {
  return (
    <Card className="shadow-md border-border/20 overflow-hidden h-full">
      <CardContent className="p-6 flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <Timer className="h-12 w-12 text-primary/60" />
          <h2 className="text-xl font-semibold">No Task Selected</h2>
          <p className="text-muted-foreground max-w-md">
            Select a task from the panel on the right to start a timer session.
            Or create a new timer task to get started.
          </p>
          <div className="mt-4 flex items-center gap-2 text-primary">
            <PlusCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Create a Timer Task</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
