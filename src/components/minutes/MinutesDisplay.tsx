
import React, { InputHTMLAttributes, useCallback, useState, useEffect, useRef } from "react";
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
  const previousMinutesRef = useRef(minutes);

  useEffect(() => {
    if (!isFocused && previousMinutesRef.current !== minutes) {
      console.log('MinutesDisplay - Minutes prop changed:', {
        previous: previousMinutesRef.current,
        new: minutes,
        isFocused
      });
      setInputValue(minutes.toString());
      previousMinutesRef.current = minutes;
    }
  }, [minutes, isFocused]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      console.log('MinutesDisplay - Input value changing:', {
        value,
        currentMinutes: minutes
      });
      setInputValue(value);
      
      if (value !== '') {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
          const clampedValue = Math.min(Math.max(numValue, minMinutes), maxMinutes);
          console.log('MinutesDisplay - Propagating valid change:', {
            rawValue: value,
            clampedValue,
            minMinutes,
            maxMinutes
          });
          const syntheticEvent = {
            ...e,
            target: { ...e.target, value: clampedValue.toString() }
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
      }
    }
  }, [onChange, minMinutes, maxMinutes, minutes]);

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
    
    console.log('MinutesDisplay - Handling blur:', {
      inputValue: value,
      finalValue,
      minMinutes,
      maxMinutes
    });
    
    setInputValue(finalValue);
    previousMinutesRef.current = parseInt(finalValue, 10);
    
    const syntheticEvent = {
      ...e,
      target: { ...e.target, value: finalValue }
    } as React.FocusEvent<HTMLInputElement>;
    onBlur(syntheticEvent);
  }, [minMinutes, maxMinutes, onBlur]);

  const handleFocus = useCallback(() => {
    console.log('MinutesDisplay - Input focused');
    setIsFocused(true);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('MinutesDisplay - Enter key pressed');
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
};

MinutesDisplay.displayName = 'MinutesDisplay';
