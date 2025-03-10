
import React from 'react';
import { Task } from '@/types/tasks';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Timer, Image, FileText, Calendar, BookOpen, CheckSquare } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  onClick: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, isSelected, onClick }) => {
  // Helper function to get task type icon
  const getTaskTypeIcon = () => {
    switch (task.taskType) {
      case 'timer':
        return <Timer className="h-4 w-4 text-purple-400" />;
      case 'screenshot':
        return <Image className="h-4 w-4 text-blue-400" />;
      case 'habit':
        return <Calendar className="h-4 w-4 text-green-400" />;
      case 'journal':
        return <BookOpen className="h-4 w-4 text-amber-400" />;
      case 'checklist':
        return <CheckSquare className="h-4 w-4 text-cyan-400" />;
      default:
        return <FileText className="h-4 w-4 text-primary" />;
    }
  };

  // Helper function to get task details based on type
  const getTaskDetails = () => {
    switch (task.taskType) {
      case 'timer':
        return task.duration ? `${Math.floor(task.duration / 60)} minutes` : null;
      case 'screenshot':
        return task.capturedText ? `${task.capturedText.substring(0, 20)}...` : 'Screenshot';
      case 'journal':
        return task.journalEntry ? `${task.journalEntry.substring(0, 20)}...` : 'Journal entry';
      case 'checklist':
        if (!task.checklistItems || task.checklistItems.length === 0) return null;
        const completed = task.checklistItems.filter(item => item.completed).length;
        return `${completed}/${task.checklistItems.length} items completed`;
      default:
        return task.description ? task.description.substring(0, 40) : null;
    }
  };

  const taskDetails = getTaskDetails();
  const isFromHabit = !!task.relationships?.habitId;
  const createdDate = new Date(task.createdAt);

  return (
    <div
      className={cn(
        'flex items-start gap-2 p-3 hover:bg-accent rounded-md cursor-pointer transition-colors',
        isSelected && 'bg-accent'
      )}
      onClick={() => onClick(task.id)}
    >
      <Checkbox
        checked={task.completed}
        className="mt-1"
        onClick={(e) => {
          e.stopPropagation();
          // Handle checkbox click - this should be provided via props if needed
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {getTaskTypeIcon()}
          <h3 className="font-medium text-sm truncate">{task.name}</h3>
          {isFromHabit && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
              habit
            </span>
          )}
        </div>
        
        {taskDetails && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {taskDetails}
          </p>
        )}
        
        <p className="text-xs text-muted-foreground mt-0.5">
          Created {formatDistanceToNow(createdDate, { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};
