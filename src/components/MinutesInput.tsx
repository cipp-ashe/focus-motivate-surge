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
    const newValue = minutes + step;
    if (newValue <= maxMinutes) {
      onMinutesChange(newValue);
    }
  };

  const handleDecrement = () => {
    const step = minutes <= 5 ? 1 : 5;
    const newValue = minutes - step;
    if (newValue >= minMinutes) {
      onMinutesChange(newValue);
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
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
      <div className="relative w-20">
        <Input
          type="number"
          min={minMinutes}
          max={maxMinutes}
          value={minutes}
          onChange={(e) => onMinutesChange(parseInt(e.target.value) || minMinutes)}
          className="text-center font-mono bg-background/50 [&::-webkit-scrollbar]:hidden [&::-webkit-inner-spin-button]:appearance-none"
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
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
    </div>
  );
});

MinutesInput.displayName = 'MinutesInput';