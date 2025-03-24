
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Task } from '@/types/tasks';
import { toast } from 'sonner';
import { eventManager } from '@/lib/events/EventManager';
import { Timer } from '@/components/timer/Timer';
import { Textarea } from '@/components/ui/textarea';
import { useTaskManager } from '@/hooks/tasks/useTaskManager';
import { timerSettingsStorage } from '@/lib/storage/timerSettings';

interface TimerViewProps {
  isVisible: boolean;
  onClose?: () => void;
}

export const TimerView: React.FC<TimerViewProps> = ({ isVisible, onClose }) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [timerNotes, setTimerNotes] = useState<string>('');
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const { updateTask } = useTaskManager();
  
  // Listen for timer:set-task events
  useEffect(() => {
    // Set up event listener for timer task
    const handleTimerTask = (task: Task) => {
      console.log('Timer view: Received task for timer', task);
      
      if (!task || !task.id) {
        console.error('Invalid task data received');
        return;
      }
      
      setActiveTask(task);
      
      // Load existing timer notes if available
      if (task.timerNotes) {
        setTimerNotes(task.timerNotes);
      } else {
        setTimerNotes('');
      }
      
      // Set default timer duration from task or use saved settings
      const settings = timerSettingsStorage.loadSettings();
      const defaultDuration = settings?.defaultFocusMinutes || 25;
      
      // Emit timer task event
      eventManager.emit('task:timer', {
        taskId: task.id,
        minutes: task.timerMinutes || task.duration ? Math.floor(task.duration / 60) : defaultDuration,
        notes: task.timerNotes
      });
    };
    
    const unsubscribe = eventManager.on('timer:set-task', handleTimerTask);
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Save timer notes
  const saveTimerNotes = useCallback(() => {
    if (!activeTask) return;
    
    // Update the task with the notes
    if (updateTask) {
      updateTask(activeTask.id, {
        timerNotes
      });
      
      toast.success('Timer notes saved');
    }
  }, [activeTask, timerNotes, updateTask]);
  
  // Clear the active task
  const clearActiveTask = useCallback(() => {
    if (timeElapsed > 0 && activeTask) {
      // Save time spent before clearing
      const timeSpentMinutes = Math.floor(timeElapsed / 60);
      console.log(`Logging ${timeSpentMinutes} minutes for task ${activeTask.id}`);
      
      // Update the task with time spent data
      if (updateTask) {
        updateTask(activeTask.id, {
          timerNotes,
          duration: (activeTask.duration || 0) + timeElapsed
        });
      }
    }
    
    setActiveTask(null);
    setTimerNotes('');
    setTimeElapsed(0);
    
    if (onClose) {
      onClose();
    }
  }, [activeTask, timeElapsed, timerNotes, updateTask, onClose]);
  
  // Handle task completion
  const completeTask = useCallback(() => {
    if (!activeTask) return;
    
    // Calculate time metrics
    const timeSpentMinutes = Math.floor(timeElapsed / 60);
    
    // Mark task as selected first to ensure UI updates
    eventManager.emit('task:select', activeTask.id);
    
    // Create metrics object
    const metrics = {
      timeSpent: timeElapsed,
      completionTime: new Date().toISOString(),
      timeSpentMinutes
    };
    
    // Save the notes first
    if (timerNotes && updateTask) {
      updateTask(activeTask.id, { timerNotes });
    }
    
    // Emit complete event with metrics
    eventManager.emit('task:complete', {
      taskId: activeTask.id,
      metrics
    });
    
    toast.success(`Task "${activeTask.name}" completed with ${timeSpentMinutes} minutes logged`);
    
    // Clear the active task
    setActiveTask(null);
    setTimerNotes('');
    setTimeElapsed(0);
    
    if (onClose) {
      onClose();
    }
  }, [activeTask, timeElapsed, timerNotes, updateTask, onClose]);
  
  // Track elapsed time from Timer component
  const handleTimeUpdate = useCallback((elapsed: number) => {
    setTimeElapsed(elapsed);
  }, []);
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <Card className="w-full md:max-w-md">
      <CardHeader>
        <CardTitle>
          {activeTask ? `Timer: ${activeTask.name}` : 'Timer'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {activeTask ? (
            <>
              <Timer 
                initialMinutes={activeTask.timerMinutes || 25}
                onTimeUpdate={handleTimeUpdate}
              />
              
              <div className="mt-4">
                <Textarea
                  placeholder="Add notes about your progress..."
                  value={timerNotes}
                  onChange={(e) => setTimerNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </>
          ) : (
            <div className="text-center p-4">
              <p>No task selected for the timer.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Select a task and click the timer icon to start timing.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={clearActiveTask}
        >
          Cancel
        </Button>
        
        <div className="space-x-2">
          {activeTask && (
            <>
              <Button 
                variant="outline" 
                onClick={saveTimerNotes}
              >
                Save Notes
              </Button>
              
              <Button 
                onClick={completeTask}
              >
                Complete Task
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
