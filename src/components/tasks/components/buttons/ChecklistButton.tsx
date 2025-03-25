
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
      className="h-7 w-7 p-0 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-100/60 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-900/20"
      onClick={handleClick}
      title="Open Checklist"
    >
      <CheckSquare className="h-4 w-4" />
    </Button>
  );
};
