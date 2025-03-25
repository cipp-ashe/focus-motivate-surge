
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare } from 'lucide-react';
import { TaskButtonProps } from './ButtonTypes';

export interface ChecklistButtonProps extends TaskButtonProps {}

export const ChecklistButton: React.FC<ChecklistButtonProps> = ({ task, onTaskAction }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onTaskAction(e, 'checklist');
  };

  return (
    <Button 
      variant="ghost"
      size="sm"
      className="h-7 w-7 p-0 text-cyan-500 hover:text-cyan-600 hover:bg-cyan-100/60 dark:text-cyan-400 dark:hover:text-cyan-300 dark:hover:bg-cyan-900/20"
      onClick={handleClick}
      title="Open Checklist"
    >
      <CheckSquare className="h-4 w-4" />
    </Button>
  );
};
