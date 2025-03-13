
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import { TaskButtonProps } from './ButtonTypes';

export interface ScreenshotButtonProps extends TaskButtonProps {}

export const ScreenshotButton: React.FC<ScreenshotButtonProps> = ({ task, onTaskAction }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onTaskAction(e, 'screenshot');
  };

  return (
    <Button 
      variant="ghost"
      size="sm"
      className="h-7 w-7 p-0 text-blue-400 hover:text-blue-600 hover:bg-blue-100"
      onClick={handleClick}
      title="View Screenshot"
    >
      <ImageIcon className="h-4 w-4" />
    </Button>
  );
};
