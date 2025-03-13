
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";

interface TimerButtonProps {
  durationInMinutes: number;
  isEditing: boolean;
  inputValue: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  preventPropagation: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

export const TimerButton: React.FC<TimerButtonProps> = ({
  durationInMinutes,
  isEditing,
  inputValue,
  handleChange,
  handleBlur,
  handleKeyDown,
  preventPropagation,
  onClick,
}) => {
  return (
    <Badge 
      variant="outline" 
      className="flex items-center gap-1 bg-primary/5 hover:bg-primary/10"
      onClick={onClick}
    >
      <Clock className="h-3.5 w-3.5 text-primary opacity-70" />
      {isEditing ? (
        <Input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={inputValue}
          className="w-12 text-right bg-transparent border-0 focus:ring-0 p-0 h-auto [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          onClick={preventPropagation}
          onTouchStart={preventPropagation}
          data-action="true"
        />
      ) : (
        <span 
          className="w-8 text-right text-primary cursor-text"
          onClick={preventPropagation}
          onTouchStart={preventPropagation}
          data-action="true"
        >
          {durationInMinutes}
        </span>
      )}
      <span className="text-primary/70 text-sm">m</span>
    </Badge>
  );
};
