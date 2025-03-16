
import React, { useState } from 'react';
import { Task } from '@/types/tasks';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, format } from 'date-fns';
import { Timer, Image, FileText, BookOpen, CheckSquare, Mic, Plus, X } from 'lucide-react';
import { TaskTags } from './TaskTags';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import { useTaskManager } from '@/hooks/tasks/useTaskManager';
import { deleteTaskOperations } from '@/lib/operations/tasks/delete';
import { Badge } from '@/components/ui/badge';

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  onClick: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, isSelected, onClick }) => {
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');
  const { updateTask } = useTaskManager();

  const getTaskTypeIcon = () => {
    switch (task.taskType) {
      case 'timer':
        return <Timer className="h-4 w-4 text-purple-400" />;
      case 'screenshot':
        return <Image className="h-4 w-4 text-blue-400" />;
      case 'journal':
        return <BookOpen className="h-4 w-4 text-amber-400" />;
      case 'checklist':
        return <CheckSquare className="h-4 w-4 text-cyan-400" />;
      case 'voicenote':
        return <Mic className="h-4 w-4 text-rose-400" />;
      case 'regular':
      default:
        return <FileText className="h-4 w-4 text-primary" />;
    }
  };

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
      case 'voicenote':
        return task.voiceNoteText ? `${task.voiceNoteText.substring(0, 40)}...` : 'Voice note';
      default:
        return task.description ? task.description.substring(0, 40) : null;
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    const updatedTags = [...(task.tags || []), { id: uuidv4(), name: newTag.trim() }];
    updateTask(task.id, { tags: updatedTags });
    setNewTag('');
    setShowTagInput(false);
  };

  const handleTagRemove = (tagId: string) => {
    const updatedTags = (task.tags || []).filter(tag => tag.id !== tagId);
    updateTask(task.id, { tags: updatedTags });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (task.relationships?.habitId && task.relationships?.date) {
      console.log(`Dismissing habit task rather than deleting: ${task.id}`);
      
      deleteTaskOperations.deleteTask(task.id, {
        isDismissal: true, 
        habitId: task.relationships.habitId,
        date: task.relationships.date
      });
    } else {
      deleteTaskOperations.deleteTask(task.id);
    }
  };

  const taskDetails = getTaskDetails();
  const isFromHabit = !!task.relationships?.habitId;
  const createdDate = new Date(task.createdAt);
  
  const formattedScheduledDate = task.relationships?.date 
    ? format(new Date(task.relationships.date), "MMM d, yyyy")
    : null;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200 group',
        isSelected ? 'bg-accent shadow-md' : 'hover:bg-accent/50'
      )}
      onClick={() => onClick(task.id)}
    >
      <Checkbox
        checked={task.completed}
        className="mt-1 border-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 py-0.5">
            {getTaskTypeIcon()}
            <h3 className="font-medium text-sm truncate">{task.name}</h3>
          </span>
          
          {isFromHabit && (
            <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 text-xs px-2">
              habit
            </Badge>
          )}
          
          {formattedScheduledDate && (
            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 text-xs px-2">
              {formattedScheduledDate}
            </Badge>
          )}
        </div>
        
        {task.tags && task.tags.length > 0 && (
          <div className="mt-2">
            <TaskTags 
              tags={task.tags} 
              readOnly={false} 
              variant="secondary" 
              size="sm" 
              onTagRemove={handleTagRemove}
              preventPropagation={(e) => e.stopPropagation()}
            />
          </div>
        )}
        
        {showTagInput ? (
          <div className="flex items-center gap-1 mt-2 bg-background/50 rounded-md p-1" onClick={(e) => e.stopPropagation()}>
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tag"
              className="h-8 text-xs rounded-md border-border/50 focus:border-primary/50"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTag();
                if (e.key === 'Escape') setShowTagInput(false);
              }}
            />
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setShowTagInput(false)}>
                <X className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="default" className="h-8 px-3" onClick={handleAddTag}>
                Add
              </Button>
            </div>
          </div>
        ) : (
          <>
            {taskDetails && (
              <p className="text-xs text-muted-foreground mt-1.5 truncate">
                {taskDetails}
              </p>
            )}
            
            <p className="text-xs text-muted-foreground mt-1">
              Created {formatDistanceToNow(createdDate, { addSuffix: true })}
            </p>
          </>
        )}
      </div>
      
      {!showTagInput && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation();
              setShowTagInput(true);
            }}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
};
