
import React, { ButtonHTMLAttributes } from "react";
import { Button } from "../ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MinutesButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  direction: "up" | "down";
  disabled?: boolean;
  "aria-label": string;
}

export const MinutesButton = ({
  direction,
  disabled,
  onClick,
  onTouchStart,
  className,
  ...props
}: MinutesButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick(e);
  };

  const handleTouch = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onTouchStart) onTouchStart(e);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      onTouchStart={handleTouch}
      className={cn(
        "h-9 w-9 border-primary/30 bg-card hover:bg-primary/10 touch-manipulation shadow-sm",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {direction === "up" ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </Button>
  );
};
