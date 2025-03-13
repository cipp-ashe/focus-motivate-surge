
import React from 'react';
import { Button } from '@/components/ui/button';
import { TimerIcon } from 'lucide-react';
import { TaskButtonProps } from './ButtonTypes';

export interface TimerButtonProps extends TaskButtonProps {}

export const TimerButton: React.FC<TimerButtonProps> = ({ task, onTaskAction }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onTaskAction(e, 'timer');
  };

  return (
    <Button 
      variant="ghost"
      size="sm"
      className="h-7 w-7 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-100"
      onClick={handleClick}
      title="Start Timer"
    >
      <TimerIcon className="h-4 w-4" />
    </Button>
  );
};
