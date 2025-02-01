import { memo, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ChevronUp, ChevronDown } from "lucide-react";
import { MinutesInputProps } from "../types/timer";
import { useIsMobile } from "@/hooks/use-mobile";

export const MinutesInput = memo(({
  minutes,
  onMinutesChange,
  minMinutes,
  maxMinutes,
  onBlur
}: MinutesInputProps) => {
  const isMobile = useIsMobile();

  const handleIncrement = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const step = minutes < 5 ? 1 : 5;
    const newValue = Math.min(minutes + step, maxMinutes);
    console.log('Incrementing to:', newValue);
    onMinutesChange(newValue);
  }, [minutes, maxMinutes, onMinutesChange]);

  const handleDecrement = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const step = minutes <= 5 ? 1 : 5;
    const newValue = Math.max(minutes - step, minMinutes);
    console.log('Decrementing to:', newValue);
    onMinutesChange(newValue);
  }, [minutes, minMinutes, onMinutesChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const value = e.target.value;
    console.log('Input value changed to:', value);
    
    if (value === '') {
      console.log('Empty input, setting to min minutes:', minMinutes);
      onMinutesChange(minMinutes);
      return;
    }

    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue)) {
      const clampedValue = Math.min(Math.max(parsedValue, minMinutes), maxMinutes);
      console.log('Setting minutes to:', clampedValue);
      onMinutesChange(clampedValue);
    }
  }, [minMinutes, maxMinutes, onMinutesChange]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isNaN(minutes) || minutes < minMinutes) {
      onMinutesChange(minMinutes);
    } else if (minutes > maxMinutes) {
      onMinutesChange(maxMinutes);
    }
    onBlur?.();
  }, [minutes, minMinutes, maxMinutes, onMinutesChange, onBlur]);

  const preventPropagation = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div 
      className="flex items-center justify-center gap-2"
      onClick={preventPropagation}
      onTouchStart={preventPropagation}
      onTouchEnd={preventPropagation}
      onTouchMove={preventPropagation}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        onTouchStart={handleDecrement}
        className="border-primary/20 hover:bg-primary/20 touch-manipulation"
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
          onBlur={handleBlur}
          onClick={preventPropagation}
          onTouchStart={preventPropagation}
          onTouchEnd={preventPropagation}
          onTouchMove={preventPropagation}
          className="text-center font-mono bg-background/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none touch-manipulation"
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
        onTouchStart={handleIncrement}
        className="border-primary/20 hover:bg-primary/20 touch-manipulation"
        disabled={minutes >= maxMinutes}
        aria-label="Increase minutes"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
    </div>
  );
});

MinutesInput.displayName = 'MinutesInput';