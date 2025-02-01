import { Button } from "../ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

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
  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick(e as React.MouseEvent);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      className={`border-primary/20 hover:bg-primary/20 touch-manipulation ${className}`}
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