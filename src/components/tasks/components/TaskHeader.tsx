
import React from 'react';
import { Task } from '@/types/tasks';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { TaskActionButton } from './TaskActionButton';
import { formatTime } from '@/utils/dateUtils';

interface TaskHeaderProps {
  task: Task;
  editingTaskId: string | null;
  inputValue: string;
  durationInMinutes: number;
  onTaskAction: (e: React.MouseEvent<HTMLButtonElement>, actionType?: string) => void;
  handleLocalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLocalBlur: () => void;
  handleLocalKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  preventPropagation: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
  onDurationClick?: (e: React.MouseEvent<HTMLElement>) => void;
  dialogOpeners?: {
    checklist?: (taskId: string, taskName: string, items: any[]) => void;
    journal?: (taskId: string, taskName: string, entry: string) => void;
    screenshot?: (imageUrl: string, taskName: string) => void;
    voicenote?: (taskId: string, taskName: string) => void;
  };
}

const TaskHeader: React.FC<TaskHeaderProps> = ({
  task,
  editingTaskId,
  inputValue,
  durationInMinutes,
  onTaskAction,
  handleLocalChange,
  handleLocalBlur,
  handleLocalKeyDown,
  preventPropagation,
  onDurationClick,
  dialogOpeners
}) => {
  const isEditing = editingTaskId === task.id;
  
  return (
    <div className="flex items-center justify-between p-3 pb-1">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            className="w-full border p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            value={inputValue}
            onChange={handleLocalChange}
            onBlur={handleLocalBlur}
            onKeyDown={handleLocalKeyDown}
            onClick={preventPropagation}
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h3 className="font-semibold truncate">{task.name}</h3>
            
            {task.taskType === 'timer' && durationInMinutes > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                className="h-6 px-2 py-0 text-xs"
                onClick={onDurationClick}
              >
                {formatTime(durationInMinutes * 60)}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-7 w-7 p-0"
              onClick={(e) => onTaskAction(e, 'edit')}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
      
      <TaskActionButton 
        task={task}
        onTaskAction={onTaskAction}
        dialogOpeners={dialogOpeners}
      />
    </div>
  );
};

export default TaskHeader;
