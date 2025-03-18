
import React, { useState } from 'react';
import { Clock, Play, Timer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createTaskOperations } from '@/lib/operations/tasks/create';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { MinutesInput } from '@/components/minutes/MinutesInput';

export const EmptyTimerState = () => {
  const [taskName, setTaskName] = useState('');
  const [minutes, setMinutes] = useState(25);
  
  const handleStartInstantTimer = () => {
    // If no task name is provided, use a default name
    const name = taskName.trim() || `Quick Timer (${minutes} min)`;
    
    // Create a new timer task
    const newTask = createTaskOperations.createTask({
      name,
      taskType: 'timer',
      duration: minutes * 60,
      completed: false,
      createdAt: new Date().toISOString(),
      status: 'active',
      tags: ['timer', 'quick-timer']
    }, {
      suppressToast: true,
      selectAfterCreate: true
    });
    
    // Emit event to select and start the timer
    eventManager.emit('timer:set-task', newTask);
    
    toast.success(`Starting ${minutes} minute timer`, {
      description: `"${name}" timer started`
    });
  };

  return (
    <div className="flex flex-col items-center justify-center text-center h-full p-6">
      <div className="mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Timer className="h-10 w-10 text-primary/70" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Start an Instant Timer</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Create a quick timer session without having to set up a task first.
        </p>
      </div>
      
      <Card className="bg-card border-primary/10 w-full max-w-md">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="task-name" className="text-sm font-medium text-left block">
              Task Name (optional)
            </label>
            <Input
              id="task-name"
              placeholder="What are you focusing on?"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-left block">
              Timer Duration
            </label>
            <div className="flex justify-center py-2">
              <MinutesInput
                minutes={minutes}
                onMinutesChange={setMinutes}
                minMinutes={1}
                maxMinutes={120}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleStartInstantTimer}
            className="w-full gap-2"
            size="lg"
          >
            <Play className="h-4 w-4" />
            Start Timer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
