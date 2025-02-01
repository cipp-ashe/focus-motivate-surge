import { Input } from "../ui/input";
import { InputHTMLAttributes } from "react";

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
  return (
    <div className="relative w-20">
      <Input
        type="number"
        min={minMinutes}
        max={maxMinutes}
        value={minutes}
        onChange={onChange}
        onBlur={onBlur}
        className={`text-center font-mono bg-background/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none touch-manipulation ${className}`}
        aria-label="Minutes input"
        {...props}
      />
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        min
      </span>
    </div>
  );
};