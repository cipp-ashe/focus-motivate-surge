
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Timer } from '@/components/ui/timer';
import { Play, Pause, SkipForward, Check, Edit, Clock, X } from 'lucide-react';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { eventManager } from '@/lib/events/EventManager';
import { useCountdownTimer } from '@/hooks/ui/useCountdownTimer';
import { Task } from '@/types/tasks';
import { formatTime } from '@/lib/utils/formatters';

// Simple class to handle timer settings
class TimerSettings {
  private static STORAGE_KEY = 'timer-settings';

  static getSettings() {
    try {
      const settings = localStorage.getItem(this.STORAGE_KEY);
      return settings ? JSON.parse(settings) : { defaultMinutes: 25 };
    } catch (error) {
      console.error('Error loading timer settings:', error);
      return { defaultMinutes: 25 };
    }
  }

  static saveSettings(settings: any) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving timer settings:', error);
      return false;
    }
  }
}

export const TimerView: React.FC = () => {
  const { items, addTask, updateTask, completeTask } = useTaskContext();
  const [timerTask, setTimerTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [notes, setNotes] = useState('');
  const [minutes, setMinutes] = useState(TimerSettings.getSettings().defaultMinutes);
  
  const { 
    isRunning, 
    isPaused, 
    elapsedTime,
    totalTime,
    startTimer, 
    pauseTimer, 
    resumeTimer, 
    stopTimer,
    resetTimer
  } = useCountdownTimer({ totalSeconds: minutes * 60 });

  // Lifecycle methods
  useEffect(() => {
    // Load the timer task if it exists
    const findActiveTimerTask = () => {
      const timerTask = items.find(task => 
        task.taskType === 'timer' && 
        !task.completed
      );
      
      if (timerTask) {
        setTimerTask(timerTask);
        setTaskName(timerTask.name);
        setNotes(timerTask.description || '');
        setMinutes(Math.floor(timerTask.duration / 60) || 25);
      }
    };
    
    findActiveTimerTask();
  }, [items]);

  // Listen for timer:set-task events
  useEffect(() => {
    const handleSetTimerTask = (task: any) => {
      // Create or update the timer task
      if (task.id) {
        setTimerTask({
          id: task.id,
          name: task.name,
          description: task.notes || '',
          taskType: 'timer',
          completed: !!task.completed,
          duration: task.duration || 1500,
          createdAt: task.createdAt || new Date().toISOString()
        });
        
        setTaskName(task.name);
        setNotes(task.notes || '');
        setMinutes(Math.floor((task.duration || 1500) / 60));
      }
    };
    
    const unsubscribe = eventManager.on('timer:set-task', handleSetTimerTask);
    return unsubscribe;
  }, []);

  // Update timer when elapsed time changes
  const handleTimeUpdate = useCallback((elapsed: number) => {
    if (timerTask && timerTask.id) {
      updateTask(timerTask.id, {
        duration: minutes * 60 - elapsed
      });
    }
  }, [timerTask, minutes, updateTask]);

  // Start a new timer
  const handleStartNewTimer = useCallback(() => {
    // Save the default minutes setting
    TimerSettings.saveSettings({ defaultMinutes: minutes });
    
    // Create a new timer task
    const newTask: Task = {
      id: crypto.randomUUID(),
      name: taskName || 'Focus Session',
      description: notes,
      taskType: 'timer',
      completed: false,
      duration: minutes * 60,
      createdAt: new Date().toISOString()
    };
    
    addTask(newTask);
    setTimerTask(newTask);
    setIsEditing(false);
    startTimer();
  }, [taskName, notes, minutes, addTask, startTimer]);

  // Complete the timer task
  const handleCompleteTimer = useCallback(() => {
    if (timerTask && timerTask.id) {
      // Mark the task as completed
      completeTask(timerTask.id);
      
      // Reset the timer
      resetTimer();
      setTimerTask(null);
      setTaskName('');
      setNotes('');
      setMinutes(TimerSettings.getSettings().defaultMinutes);
    }
  }, [timerTask, completeTask, resetTimer]);

  // Discard the timer task
  const handleDiscardTimer = useCallback(() => {
    if (timerTask && timerTask.id) {
      // Update the task as cancelled
      updateTask(timerTask.id, {
        dismissedAt: new Date().toISOString(),
        clearReason: 'dismissed'
      });
      
      // Reset the timer
      resetTimer();
      setTimerTask(null);
      setTaskName('');
      setNotes('');
      setMinutes(TimerSettings.getSettings().defaultMinutes);
    }
  }, [timerTask, updateTask, resetTimer]);

  // Render timer controls
  const renderTimerControls = () => {
    if (!timerTask) {
      return (
        <Button 
          className="w-full" 
          onClick={handleStartNewTimer}
          disabled={!taskName.trim()}
        >
          <Play className="mr-2 h-4 w-4" />
          Start Timer
        </Button>
      );
    }
    
    if (isRunning) {
      return (
        <div className="flex space-x-2">
          <Button 
            className="flex-1" 
            variant="outline" 
            onClick={pauseTimer}
          >
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleCompleteTimer}
          >
            <Check className="mr-2 h-4 w-4" />
            Complete
          </Button>
        </div>
      );
    }
    
    if (isPaused) {
      return (
        <div className="flex space-x-2">
          <Button 
            className="flex-1" 
            onClick={resumeTimer}
          >
            <Play className="mr-2 h-4 w-4" />
            Resume
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleCompleteTimer}
          >
            <Check className="mr-2 h-4 w-4" />
            Complete
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleDiscardTimer}
          >
            <X className="mr-2 h-4 w-4" />
            Discard
          </Button>
        </div>
      );
    }
    
    return (
      <div className="flex space-x-2">
        <Button 
          className="flex-1" 
          onClick={startTimer}
        >
          <Play className="mr-2 h-4 w-4" />
          Start
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => setIsEditing(true)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      {/* Timer Display */}
      <div className="flex justify-center">
        <div className="timer-display text-center p-8">
          <Timer 
            totalSeconds={minutes * 60} 
            onTimeUpdate={handleTimeUpdate} 
            isRunning={isRunning} 
            isPaused={isPaused}
          />
          <div className="mt-4 text-2xl font-medium">
            {formatTime(totalTime - elapsedTime)}
          </div>
        </div>
      </div>
      
      {/* Task Info */}
      {isEditing || !timerTask ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Task Name</label>
            <Input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="What are you working on?"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes or details (optional)"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
            <div className="flex space-x-2">
              {[5, 15, 25, 45, 60].map((preset) => (
                <Button
                  key={preset}
                  variant={minutes === preset ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMinutes(preset)}
                >
                  {preset}
                </Button>
              ))}
              <Input
                type="number"
                min="1"
                max="120"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="w-20"
              />
            </div>
          </div>
        </div>
      ) : (
        <Card className="p-4">
          <h3 className="text-lg font-semibold">{timerTask.name}</h3>
          {timerTask.description && (
            <p className="text-sm text-muted-foreground mt-1">{timerTask.description}</p>
          )}
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatTime(minutes * 60)}</span>
          </div>
        </Card>
      )}
      
      {/* Controls */}
      <div className="mt-4">
        {renderTimerControls()}
      </div>
    </div>
  );
};
