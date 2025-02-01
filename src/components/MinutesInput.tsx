import { memo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ChevronUp, ChevronDown } from "lucide-react";
import { MinutesInputProps } from "../types/timer";

export const MinutesInput = memo(({
  minutes,
  onMinutesChange,
  minMinutes,
  maxMinutes
}: MinutesInputProps) => {
  const handleIncrement = () => {
    const step = minutes < 5 ? 1 : 5;
    const newValue = Math.min(minutes + step, maxMinutes);
    onMinutesChange(newValue);
  };

  const handleDecrement = () => {
    const step = minutes <= 5 ? 1 : 5;
    const newValue = Math.max(minutes - step, minMinutes);
    onMinutesChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty input while typing
    if (inputValue === '') {
      onMinutesChange(minMinutes);
      return;
    }

    // Parse the input value
    const parsedValue = parseInt(inputValue, 10);
    
    // Only update if it's a valid number
    if (!isNaN(parsedValue)) {
      // Clamp the value between min and max
      const clampedValue = Math.min(Math.max(parsedValue, minMinutes), maxMinutes);
      onMinutesChange(clampedValue);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        className="border-primary/20 hover:bg-primary/20"
        disabled={minutes <= minMinutes}
        aria-label="Decrease minutes"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
      <div className="relative w-20">
        <Input
          type="number"
          min={minMinutes}
          max={maxMinutes}
          value={minutes}
          onChange={handleInputChange}
          onBlur={() => {
            // Ensure valid number on blur
            if (isNaN(minutes) || minutes < minMinutes) {
              onMinutesChange(minMinutes);
            } else if (minutes > maxMinutes) {
              onMinutesChange(maxMinutes);
            }
          }}
          className="text-center font-mono bg-background/50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          aria-label="Minutes input"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          min
        </span>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        className="border-primary/20 hover:bg-primary/20"
        disabled={minutes >= maxMinutes}
        aria-label="Increase minutes"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
    </div>
  );
});

MinutesInput.displayName = 'MinutesInput';