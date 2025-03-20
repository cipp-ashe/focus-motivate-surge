
import React from 'react';
import { Task } from '@/types/tasks';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { 
  Check, Trash2, Clock, Camera, FileText, ListChecks, Mic, Timer, MoreVertical
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { TaskTags } from './TaskTags';

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<Task>) => void;
  onComplete: (metrics?: any) => void;
  dialogOpeners?: {
    checklist?: (taskId: string, taskName: string, items: any[]) => void;
    journal?: (taskId: string, taskName: string, entry: string) => void;
    screenshot?: (imageUrl: string, taskName: string) => void;
    voicenote?: (taskId: string, taskName: string) => void;
  };
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isSelected,
  onSelect,
  onDelete,
  onUpdate,
  onComplete,
  dialogOpeners
}) => {
  const handleComplete = () => {
    onComplete({ completedAt: new Date().toISOString() });
  };
  
  const getTaskTypeIcon = () => {
    switch (task.taskType) {
      case 'timer':
        return <Timer className="h-4 w-4 text-blue-500" />;
      case 'screenshot':
        return <Camera className="h-4 w-4 text-purple-500" />;
      case 'journal':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'checklist':
        return <ListChecks className="h-4 w-4 text-amber-500" />;
      case 'voicenote':
        return <Mic className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  const handleTaskAction = () => {
    if (!dialogOpeners) return;
    
    switch (task.taskType) {
      case 'checklist':
        if (dialogOpeners.checklist) {
          dialogOpeners.checklist(task.id, task.name, task.checklistItems || []);
        }
        break;
      case 'journal':
        if (dialogOpeners.journal) {
          dialogOpeners.journal(task.id, task.name, task.journalEntry || '');
        }
        break;
      case 'screenshot':
        if (dialogOpeners.screenshot && task.imageUrl) {
          dialogOpeners.screenshot(task.imageUrl, task.name);
        }
        break;
      case 'voicenote':
        if (dialogOpeners.voicenote) {
          dialogOpeners.voicenote(task.id, task.name);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div 
      className={cn(
        "relative border rounded-md p-3 transition-colors",
        isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-accent/50",
        task.completed && "opacity-60"
      )}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={handleComplete}
            onClick={(e) => e.stopPropagation()}
            className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className={cn(
              "font-medium text-sm truncate",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.name}
            </h3>
            
            {getTaskTypeIcon() && (
              <span 
                className="cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskAction();
                }}
              >
                {getTaskTypeIcon()}
              </span>
            )}
            
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag.id} variant="outline" className="text-xs py-0">
                    {tag.name}
                  </Badge>
                ))}
                {task.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs py-0">
                    +{task.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center text-xs text-muted-foreground">
            {task.duration && (
              <span className="flex items-center mr-3">
                <Clock className="h-3 w-3 mr-1" />
                {Math.floor(task.duration / 60)} min
              </span>
            )}
            
            {task.createdAt && (
              <span>
                Added {new Date(task.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!task.completed && (
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  handleComplete();
                }}>
                  <Check className="mr-2 h-4 w-4" />
                  <span>Complete</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
