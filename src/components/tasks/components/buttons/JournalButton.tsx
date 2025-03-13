
import React from 'react';
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';
import { TaskButtonProps } from './ButtonTypes';

export interface JournalButtonProps extends TaskButtonProps {}

export const JournalButton: React.FC<JournalButtonProps> = ({ task, onTaskAction }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onTaskAction(e, 'journal');
  };

  return (
    <Button 
      variant="ghost"
      size="sm"
      className="h-7 w-7 p-0 text-green-500 hover:text-green-700 hover:bg-green-100"
      onClick={handleClick}
      title="Open Journal Entry"
    >
      <PencilIcon className="h-4 w-4" />
    </Button>
  );
};
