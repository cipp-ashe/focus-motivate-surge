import { useState, useEffect, useCallback } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Plus, Check, Sparkles, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

interface TimerProps {
  duration: number;
  taskName: string;
  onComplete: () => void;
  onAddTime: () => void;
  onDurationChange?: (minutes: number) => void;
}

const SOUND_OPTIONS = {
  bell: "https://cdn.freesound.org/previews/80/80921_1022651-lq.mp3",
  chime: "https://cdn.freesound.org/previews/411/411089_5121236-lq.mp3",
  ding: "https://cdn.freesound.org/previews/536/536108_11943129-lq.mp3",
  none: "",
};

export const Timer = ({ duration, taskName, onComplete, onAddTime, onDurationChange }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(duration);

  // Sync timeLeft with duration prop changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);
  const [isRunning, setIsRunning] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [minutes, setMinutes] = useState(Math.floor(duration / 60));
  const [selectedSound, setSelectedSound] = useState<keyof typeof SOUND_OPTIONS>("bell");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMinutesChange = (value: number) => {
    const newMinutes = Math.max(1, Math.min(60, value));
    setMinutes(newMinutes);
    const newDuration = newMinutes * 60;
    setTimeLeft(newDuration);
    onDurationChange?.(newMinutes);
  };

  const playCompletionSound = () => {
    if (selectedSound === "none") return;
    
    const audio = new Audio(SOUND_OPTIONS[selectedSound]);
    
    // Test sound on selection
    audio.play()
      .then(() => {
        console.log("Sound played successfully");
        toast.success("Sound test successful!");
      })
      .catch((error) => {
        console.error("Error playing sound:", error);
        toast.error("Could not play sound. Please check your browser settings.");
      });
  };

  // Add a test sound button
  const testSound = () => {
    if (selectedSound === "none") {
      toast("No sound selected");
      return;
    }
    playCompletionSound();
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    setIsExpanded(true);
    if (!isRunning) {
      toast("Timer started! You've got this! 🚀");
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            setShowActions(true);
            playCompletionSound();
            toast("Time's up! Great work! ✨");
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, playCompletionSound]);

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
        isExpanded ? 'scale-[1.02]' : ''
      } origin-center`}
    >
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 truncate">
          {taskName}
        </h2>

        {!isRunning && !showActions && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleMinutesChange(minutes - 1)}
                className="border-primary/20 hover:bg-primary/20"
                disabled={minutes <= 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <div className="relative w-20">
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={minutes}
                  onChange={(e) => handleMinutesChange(parseInt(e.target.value) || 1)}
                  className="text-center font-mono bg-background/50"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  min
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleMinutesChange(minutes + 1)}
                className="border-primary/20 hover:bg-primary/20"
                disabled={minutes >= 60}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Completion Sound</Label>
              <RadioGroup
                value={selectedSound}
                onValueChange={(value: keyof typeof SOUND_OPTIONS) => setSelectedSound(value)}
                className="flex justify-center gap-4"
              >
                {Object.keys(SOUND_OPTIONS).map((sound) => (
                  <div key={sound} className="flex items-center space-x-2">
                    <RadioGroupItem value={sound} id={sound} />
                    <Label htmlFor={sound} className="capitalize">{sound}</Label>
                  </div>
                ))}
              </RadioGroup>
              <Button
                variant="outline"
                size="sm"
                onClick={testSound}
                className="mt-2"
              >
                Test Sound
              </Button>
            </div>
          </div>
        )}

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
              strokeDashoffset={283 * (timeLeft / (minutes * 60))}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        {!showActions ? (
          <div className="space-y-2">
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
            {isRunning && (
              <Button
                onClick={handleComplete}
                variant="outline"
                className="w-full border-primary/20 hover:bg-primary/20"
              >
                <Check className="mr-2 h-4 w-4" />
                Complete Early
              </Button>
            )}
          </div>
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
