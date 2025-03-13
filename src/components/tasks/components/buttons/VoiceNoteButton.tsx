
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

interface VoiceNoteButtonProps {
  hasRecording: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const VoiceNoteButton: React.FC<VoiceNoteButtonProps> = ({
  hasRecording,
  onClick,
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="h-7 px-2 flex items-center gap-1 text-xs"
    >
      <Mic className="h-3.5 w-3.5 text-rose-400" />
      <span>{hasRecording ? 'Listen' : 'Record'}</span>
    </Button>
  );
};
