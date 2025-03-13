
import React from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface JournalButtonProps {
  hasEntry: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const JournalButton: React.FC<JournalButtonProps> = ({
  hasEntry,
  onClick,
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="h-7 px-2 flex items-center gap-1 text-xs"
    >
      <BookOpen className="h-3.5 w-3.5 text-amber-400" />
      <span>{hasEntry ? 'View' : 'Write'}</span>
    </Button>
  );
};
