
import React from 'react';
import { Button } from '@/components/ui/button';
import { ClipboardListIcon } from 'lucide-react';
import { TaskButtonProps } from './ButtonTypes';

export interface ChecklistButtonProps extends TaskButtonProps {}

export const ChecklistButton: React.FC<ChecklistButtonProps> = ({ task, onTaskAction }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onTaskAction(e, 'true');
  };

  return (
    <Button 
      variant="ghost"
      size="sm"
      className="h-7 w-7 p-0 text-amber-500 hover:text-amber-700 hover:bg-amber-100"
      onClick={handleClick}
      title="Open Checklist"
    >
      <ClipboardListIcon className="h-4 w-4" />
    </Button>
  );
};
