
import React from 'react';
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';
import { TaskButtonProps } from './ButtonTypes';
import { eventManager } from '@/lib/events/EventManager';

export interface JournalButtonProps extends TaskButtonProps {}

export const JournalButton: React.FC<JournalButtonProps> = ({ task, onTaskAction }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    // First call the generic task action handler
    onTaskAction(e, 'journal');
    
    // Then emit the journal:open event with the relevant data
    eventManager.emit('journal:open', {
      habitId: task.relationships?.habitId,
      habitName: task.name,
      description: task.description,
      templateId: task.relationships?.templateId,
      taskId: task.id,
      date: task.relationships?.date || new Date().toISOString()
    });
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
