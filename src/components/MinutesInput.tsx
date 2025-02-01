import { memo, useCallback } from "react";
import { MinutesInputProps } from "../types/timer";
import { MinutesButton } from "./minutes/MinutesButton";
import { MinutesDisplay } from "./minutes/MinutesDisplay";

export const MinutesInput = memo(({
  minutes,
  onMinutesChange,
  minMinutes,
  maxMinutes,
  onBlur
}: MinutesInputProps) => {
  const handleIncrement = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const step = minutes < 5 ? 1 : 5;
    const newValue = Math.min(minutes + step, maxMinutes);
    console.log('Incrementing to:', newValue);
    onMinutesChange(newValue);
  }, [minutes, maxMinutes, onMinutesChange]);

  const handleDecrement = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const step = minutes <= 5 ? 1 : 5;
    const newValue = Math.max(minutes - step, minMinutes);
    console.log('Decrementing to:', newValue);
    onMinutesChange(newValue);
  }, [minutes, minMinutes, onMinutesChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (isNaN(minutes) || minutes < minMinutes) {
      onMinutesChange(minMinutes);
    } else if (minutes > maxMinutes) {
      onMinutesChange(maxMinutes);
    }
    onBlur?.();
  }, [minutes, minMinutes, maxMinutes, onMinutesChange, onBlur]);

  return (
    <div className="flex items-center justify-center gap-2">
      <MinutesButton
        direction="down"
        onClick={handleDecrement}
        onTouchStart={handleDecrement}
        disabled={minutes <= minMinutes}
        aria-label="Decrease minutes"
      />
      
      <MinutesDisplay
        minutes={minutes}
        onChange={handleInputChange}
        onBlur={handleBlur}
        minMinutes={minMinutes}
        maxMinutes={maxMinutes}
      />

      <MinutesButton
        direction="up"
        onClick={handleIncrement}
        onTouchStart={handleIncrement}
        disabled={minutes >= maxMinutes}
        aria-label="Increase minutes"
      />
    </div>
  );
});

MinutesInput.displayName = 'MinutesInput';