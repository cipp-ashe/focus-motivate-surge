
import React from 'react';
import { Button } from '@/components/ui/button';
import { MicIcon } from 'lucide-react';
import { TaskButtonProps } from './ButtonTypes';

export interface VoiceNoteButtonProps extends TaskButtonProps {}

export const VoiceNoteButton: React.FC<VoiceNoteButtonProps> = ({ task, onTaskAction }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onTaskAction(e, 'voicenote');
  };

  return (
    <Button 
      variant="ghost"
      size="sm"
      className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
      onClick={handleClick}
      title="Record Voice Note"
    >
      <MicIcon className="h-4 w-4" />
    </Button>
  );
};
