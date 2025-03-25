
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare } from 'lucide-react';
import { TaskButtonProps } from './ButtonTypes';
import { getTaskColorClass } from '@/utils/taskTypeConfig';

export interface ChecklistButtonProps extends TaskButtonProps {}

export const ChecklistButton: React.FC<ChecklistButtonProps> = ({ task, onTaskAction }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onTaskAction(e, 'checklist');
  };

  // Get colors from the centralized config
  const iconColorClass = getTaskColorClass('checklist', 'icon');
  const hoverBgClass = 'hover:bg-cyan-100/60 dark:hover:bg-cyan-900/20';

  return (
    <Button 
      variant="ghost"
      size="sm"
      className={`h-7 w-7 p-0 ${iconColorClass} ${hoverBgClass}`}
      onClick={handleClick}
      title="Open Checklist"
    >
      <CheckSquare className="h-4 w-4" />
    </Button>
  );
};
