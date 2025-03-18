
import React from 'react';
import { Clock, ArrowRight, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const EmptyTimerState = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full p-6">
      <div className="mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Clock className="h-10 w-10 text-primary/70" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No Timer Selected</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Select an existing task or create a new timer task to get started with your focus session.
        </p>
      </div>
      
      <div className="space-y-4 w-full max-w-md">
        <Card className="bg-accent/5 border-primary/10 w-full transition-all hover:bg-accent/10 hover:border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <ArrowRight className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0" />
              <h3 className="font-medium text-sm">Choose a task from the panel</h3>
            </div>
            <p className="text-xs text-muted-foreground pl-6">
              Select an existing timer task from the panel on the right.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-accent/5 border-primary/10 w-full transition-all hover:bg-accent/10 hover:border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <Plus className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
              <h3 className="font-medium text-sm">Create a new timer task</h3>
            </div>
            <p className="text-xs text-muted-foreground pl-6">
              Add a new task to track with the timer feature.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
