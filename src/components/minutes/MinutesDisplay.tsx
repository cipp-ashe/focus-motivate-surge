
import React, { InputHTMLAttributes, useCallback, useState, useEffect } from "react";
import { Input } from "../ui/input";

interface MinutesDisplayProps extends InputHTMLAttributes<HTMLInputElement> {
  minutes: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  minMinutes: number;
  maxMinutes: number;
}

export const MinutesDisplay = ({
  minutes,
  onChange,
  onBlur,
  minMinutes,
  maxMinutes,
  className,
  ...props
}: MinutesDisplayProps) => {
  const [inputValue, setInputValue] = useState(minutes.toString());
  const [isFocused, setIsFocused] = useState(false);

  // Update local input value when minutes prop changes
  useEffect(() => {
    if (!isFocused) {
      console.log('MinutesDisplay updating input value:', minutes);
      setInputValue(minutes.toString());
    }
  }, [minutes, isFocused]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      console.log('MinutesDisplay handling change:', value);
      setInputValue(value);
      onChange(e);
    }
  }, [onChange]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    const value = e.target.value;
    
    let finalValue: string;
    if (value === '' || isNaN(parseInt(value, 10))) {
      finalValue = minMinutes.toString();
    } else {
      const numValue = parseInt(value, 10);
      finalValue = Math.min(Math.max(numValue, minMinutes), maxMinutes).toString();
    }
    
    console.log('MinutesDisplay handling blur, final value:', finalValue);
    setInputValue(finalValue);
    
    const syntheticEvent = {
      ...e,
      target: { ...e.target, value: finalValue }
    } as React.FocusEvent<HTMLInputElement>;
    onBlur(syntheticEvent);
  }, [minMinutes, maxMinutes, onBlur]);

  const handleFocus = useCallback(() => {
    console.log('MinutesDisplay focus');
    setIsFocused(true);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('MinutesDisplay Enter pressed');
      e.currentTarget.blur();
    }
  }, []);

  return (
    <div className="relative w-20">
      <Input
        type="text"
        inputMode="numeric"
        pattern="\d*"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        className={`text-center font-mono bg-background/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none touch-manipulation overflow-hidden ${className}`}
        aria-label="Minutes input"
        {...props}
      />
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
        min
      </span>
    </div>
  );
});

MinutesDisplay.displayName = 'MinutesDisplay';
