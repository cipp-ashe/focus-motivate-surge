import { useState, useEffect, useCallback } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Plus, Check, Sparkles, ChevronUp, ChevronDown, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { QuoteDisplay } from "./QuoteDisplay";

interface TimerProps {
  duration: number;
  taskName: string;
  onComplete: () => void;
  onAddTime: () => void;
  onDurationChange?: (minutes: number) => void;
  favorites: { text: string; author: string; timestamp?: string; task?: string; }[];
  setFavorites: React.Dispatch<React.SetStateAction<{ text: string; author: string; timestamp?: string; task?: string; }[]>>;
}

// Circle circumference (2πr) where r=45 is the radius of the SVG circle
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 45;

const SOUND_OPTIONS = {
  bell: "https://cdn.freesound.org/previews/80/80921_1022651-lq.mp3",
  chime: "https://cdn.freesound.org/previews/411/411089_5121236-lq.mp3",
  ding: "https://cdn.freesound.org/previews/536/536108_11943129-lq.mp3",
  none: "",
};

export const Timer = ({
  duration,
  taskName,
  onComplete,
  onAddTime,
  onDurationChange,
  favorites,
  setFavorites
}: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [minutes, setMinutes] = useState(Math.floor(duration / 60));
  const [selectedSound, setSelectedSound] = useState<keyof typeof SOUND_OPTIONS>("bell");

  // Sync timeLeft with duration prop changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  // Reset timeLeft when minutes change
  useEffect(() => {
    setTimeLeft(minutes * 60);
  }, [minutes]);

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

  const playCompletionSound = useCallback(() => {
    if (selectedSound === "none") return;
    const audio = new Audio(SOUND_OPTIONS[selectedSound]);
    audio.play()
      .then(() => {
        console.log("Sound played successfully");
        toast.success("Sound test successful!");
      })
      .catch((error) => {
        console.error("Error playing sound:", error);
        toast.error("Could not play sound. Please check your browser settings.");
      });
  }, [selectedSound]);

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
            setIsExpanded(false);
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

  const renderTimer = (size: 'normal' | 'large') => (
    <div className={`relative mx-auto ${size === 'large' ? 'w-96 h-96' : 'w-48 h-48'}`}>
      <svg className={`timer-circle ${isRunning ? 'active' : ''}`} viewBox="0 0 100 100">
        <circle
          className="text-muted/10 stroke-current"
          strokeWidth="4"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          className={`stroke-current transition-all duration-1000 ${
            isRunning
              ? 'text-primary filter drop-shadow-[0_0_6px_rgba(168,85,247,0.3)]'
              : 'text-primary/50'
          }`}
          strokeWidth="4"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          strokeLinecap="round"
          strokeDasharray={CIRCLE_CIRCUMFERENCE}
          strokeDashoffset={CIRCLE_CIRCUMFERENCE * ((minutes * 60 - timeLeft) / (minutes * 60))}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-mono font-bold ${size === 'large' ? 'text-6xl' : 'text-3xl'}`}>
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );

  return (
    <>
      {!isExpanded ? (
        // Normal view
        <Card className="mx-auto bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg p-6">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 truncate">
              {taskName}
            </h2>

            <div className={`overflow-hidden transition-all duration-700 ${
              isRunning ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100 mt-6'
            }`}>
              <div className="space-y-6">
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
                    className="flex flex-wrap justify-center gap-4"
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
            </div>

            {renderTimer('normal')}

            <div className="mt-4 space-y-2">
              <Button
                onClick={toggleTimer}
                className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary"
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
          </div>
        </Card>
      ) : (
        <div className="fixed inset-0 z-50">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-background" />
          
          {/* Close button */}
          {!isRunning && (
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground z-50"
            >
              <X className="h-6 w-6" />
            </button>
          )}
          
          {/* Content container */}
          <div className="flex flex-col items-center max-h-screen overflow-auto py-6 px-4">
            {/* Timer card */}
            <div className="w-full max-w-xl">
              <Card className="bg-card shadow-lg p-6 border-primary/20">
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                    {taskName}
                  </h2>
                  
                  <div className="w-72 h-72 mx-auto">
                    {renderTimer('large')}
                  </div>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={toggleTimer}
                      className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary"
                    >
                      {isRunning ? (
                        <>
                          <Clock className="mr-2 h-5 w-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Start
                        </>
                      )}
                    </Button>
                    {isRunning && (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleComplete}
                          variant="outline"
                          className="flex-1 border-primary/20 hover:bg-primary/20"
                        >
                          <Check className="mr-2 h-5 w-5" />
                          Complete
                        </Button>
                        <Button
                          onClick={handleAddTime}
                          variant="outline"
                          className="flex-1 border-primary/20 hover:bg-primary/20"
                        >
                          <Plus className="mr-2 h-5 w-5" />
                          Add 5m
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Quotes section */}
            <div className="w-full max-w-xl mt-4">
              <div className="bg-card/30 rounded-lg">
                <QuoteDisplay
                  showAsOverlay
                  currentTask={taskName}
                  favorites={favorites}
                  setFavorites={setFavorites}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
