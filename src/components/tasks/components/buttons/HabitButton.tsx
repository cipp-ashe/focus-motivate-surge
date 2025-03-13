
import React from 'react';
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface HabitButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const HabitButton: React.FC<HabitButtonProps> = ({
  onClick,
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="h-7 px-2 flex items-center gap-1 text-xs bg-green-500/10 hover:bg-green-500/20 text-green-500"
    >
      <Zap className="h-3.5 w-3.5 text-green-500" />
      <span>View Habit</span>
    </Button>
  );
};
