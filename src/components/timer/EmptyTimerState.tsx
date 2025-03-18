
import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const EmptyTimerState = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full p-4">
      <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-6">
        <Clock className="h-12 w-12 text-purple-500" />
      </div>
      
      <h2 className="text-xl font-semibold mb-2">No Task Selected</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        Select a task from the list on the right to start a focus timer session.
      </p>
      
      <Card className="bg-accent/5 border-primary/10 max-w-md w-full mb-4">
        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            <ArrowRight className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0" />
            <h3 className="font-medium text-sm">Choose a task from the Tasks tab</h3>
          </div>
          <p className="text-xs text-muted-foreground pl-6">
            Select an existing timer task from the panel on the right.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
