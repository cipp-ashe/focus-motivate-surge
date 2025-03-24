import React, { useState, useEffect, useRef } from 'react';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Skip, Square, Check } from 'lucide-react';
import { toast } from 'sonner';

// Let's fix the TimerView component
// We'll focus on the event handlers and task type

const TimerView = () => {
  // State for timer
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [notes, setNotes] = useState('');
  const timerRef = useRef<number | null>(null);
  
  // Set up timer task event listener
  useEffect(() => {
    // Handle timer task
    const handleSetTimerTask = (task: any) => {
      // Store the task
      if (!task || !task.id) {
        console.error('Invalid task for timer:', task);
        return;
      }
      
      console.log('Setting timer task:', task);
      
      // Make sure task has all the properties we need
      const fullTask: Task = {
        id: task.id,
        name: task.name,
        completed: task.completed || false,
        createdAt: task.createdAt || new Date().toISOString(),
        taskType: task.taskType || 'timer',
        duration: task.duration || 1500, // Default to 25 minutes
        ...task
      };
      
      setCurrentTask(fullTask);
      
      // Set the initial time from the task
      const duration = fullTask.duration || 1500; // Default to 25 minutes
      setSecondsRemaining(duration);
      
      // Notify the user
      toast.success(`Timer set for: ${fullTask.name}`);
    };
    
    // Add event listener
    const unsubscribe = eventManager.on('timer:set-task', handleSetTimerTask);
    
    // Clean up event listener
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Handle timer logic
  const startTimer = () => {
    setIsTimerRunning(true);
    timerRef.current = window.setInterval(() => {
      setSecondsRemaining((prevSeconds) => {
        if (prevSeconds <= 0) {
          clearInterval(timerRef.current!);
          setIsTimerRunning(false);
          toast.success('Timer completed!');
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
  };
  
  const pauseTimer = () => {
    setIsTimerRunning(false);
    clearInterval(timerRef.current!);
  };
  
  const resetTimer = () => {
    setIsTimerRunning(false);
    clearInterval(timerRef.current!);
    setSecondsRemaining(currentTask?.duration || 1500);
    setNotes('');
  };
  
  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  
  // Handle task completion
  const handleCompleteTask = () => {
    if (!currentTask) return;
    
    // Calculate time spent
    const timeSpent = (currentTask.duration || 0) - secondsRemaining;
    
    // Create metrics
    const metrics = {
      timeSpent,
      timerMinutes: Math.ceil(timeSpent / 60),
      notes: notes || undefined,
    };
    
    // Emit task completion event
    eventManager.emit('task:complete', { 
      taskId: currentTask.id,
      metrics 
    });
    
    // Reset timer
    resetTimer();
    
    // Show toast
    toast.success(`Completed: ${currentTask.name}`);
  };
  
  // Handle selecting task
  const handleSelectTask = () => {
    if (!currentTask) return;
    
    eventManager.emit('task:select', currentTask.id);
  };
  
  // Update notes
  const updateNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    
    // Update the current task in memory
    if (currentTask) {
      setCurrentTask({
        ...currentTask,
        timerNotes: e.target.value
      });
    }
  };
  
  // Render method
  return (
    <Card className="w-full">
      <CardContent className="p-5">
        {/* Task Display */}
        {currentTask ? (
          <div>
            <h2 className="text-lg font-semibold">{currentTask.name}</h2>
            <p className="text-muted-foreground">
              Time Remaining: {formatTime(secondsRemaining)}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground">No task selected. Set a timer from the task list.</p>
        )}
        
        {/* Notes section */}
        <div className="mt-4">
          <Textarea
            placeholder="Add notes about your session..."
            className="resize-none"
            value={notes}
            onChange={updateNotes}
          />
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-2 mt-4 justify-between">
          <div className="flex flex-wrap gap-2">
            {isTimerRunning ? (
              <Button
                variant="outline"
                size="default"
                onClick={pauseTimer}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            ) : (
              <Button
                variant="default"
                size="default"
                onClick={startTimer}
                disabled={!currentTask}
              >
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
            )}
            
            <Button
              variant="outline"
              size="default"
              onClick={resetTimer}
              disabled={!currentTask}
            >
              <Square className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          
          <Button
            variant="default"
            size="default"
            onClick={handleCompleteTask}
            disabled={!currentTask}
          >
            <Check className="h-4 w-4 mr-2" />
            Complete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimerView;
