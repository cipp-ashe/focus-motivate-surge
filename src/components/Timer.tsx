import { useState, useEffect, useCallback } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Plus, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface TimerProps {
  duration: number;
  taskName: string;
  onComplete: () => void;
  onAddTime: () => void;
}

export const Timer = ({ duration, taskName, onComplete, onAddTime }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    setIsExpanded(true);
    if (!isRunning) {
      toast("Timer started! You've got this! 🚀");
    }
  };

  useEffect(() => {
    let interval: number;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            setShowActions(true);
            toast("Time's up! Great work! ✨");
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleComplete = useCallback(() => {
    onComplete();
    setShowActions(false);
    setIsExpanded(false);
    toast("Task completed! You're crushing it! 🎉");
  }, [onComplete]);

  const handleAddTime = useCallback(() => {
    onAddTime();
    setTimeLeft((prev) => prev + 300);
    setShowActions(false);
    setIsRunning(true);
    toast("Added 5 minutes. Keep the momentum going! 💪");
  }, [onAddTime]);

  return (
    <Card 
      className={`p-8 mx-auto bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg transition-all duration-300 ${
        isExpanded ? 'scale-105' : ''
      }`}
    >
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 truncate">
          {taskName}
        </h2>
        <div className="relative w-48 h-48 mx-auto">
          <svg className={`timer-circle ${isRunning ? 'active' : ''}`} viewBox="0 0 100 100">
            <circle
              className="text-muted stroke-current"
              strokeWidth="4"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            <circle
              className="text-primary stroke-current transition-all duration-1000"
              strokeWidth="4"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              strokeDasharray="283"
              strokeDashoffset={283 * (timeLeft / duration)}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        {!showActions ? (
          <Button
            onClick={toggleTimer}
            className="w-full transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary"
          >
            {isRunning ? (
              <>
                <Clock className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Start
              </>
            )}
          </Button>
        ) : (
          <div className="flex gap-4">
            <Button
              onClick={handleComplete}
              className="flex-1 bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary"
            >
              <Check className="mr-2 h-4 w-4" />
              Complete
            </Button>
            <Button
              onClick={handleAddTime}
              variant="outline"
              className="flex-1 border-primary/20 hover:bg-primary/20"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add 5m
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};