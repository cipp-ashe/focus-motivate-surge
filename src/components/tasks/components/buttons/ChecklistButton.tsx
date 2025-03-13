
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckSquare } from "lucide-react";

interface ChecklistButtonProps {
  hasItems: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ChecklistButton: React.FC<ChecklistButtonProps> = ({
  hasItems,
  onClick,
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="h-7 px-2 flex items-center gap-1 text-xs"
    >
      <CheckSquare className="h-3.5 w-3.5 text-cyan-400" />
      <span>{hasItems ? 'View' : 'Create'} Checklist</span>
    </Button>
  );
};
