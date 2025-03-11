import React, { useState } from 'react';
import { Task, Tag } from '@/types/tasks';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, format } from 'date-fns';
import { Timer, Image, FileText, Calendar, BookOpen, CheckSquare, Mic, Plus } from 'lucide-react';
import { TaskTags } from './TaskTags';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import { useTaskManager } from '@/hooks/tasks/useTaskManager';

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  onClick: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, isSelected, onClick }) => {
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');
  const { updateTask } = useTaskManager();

  // Helper function to get task type icon
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

  const taskDetails = getTaskDetails();
  const isFromHabit = !!task.relationships?.habitId;
  const createdDate = new Date(task.createdAt);
  
  // Format the task's scheduled date if it exists
  const formattedScheduledDate = task.relationships?.date 
    ? format(new Date(task.relationships.date), "MMM d, yyyy")
    : null;

  return (
    <div
      className={cn(
        'flex items-start gap-2 p-3 hover:bg-accent rounded-md cursor-pointer transition-colors relative group',
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
          {formattedScheduledDate && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
              {formattedScheduledDate}
            </span>
          )}
        </div>
        
        {task.tags && task.tags.length > 0 && (
          <div className="mt-1">
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
          <div className="flex items-center gap-1 mt-1" onClick={(e) => e.stopPropagation()}>
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Tag name"
              className="h-7 text-xs"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTag();
                if (e.key === 'Escape') setShowTagInput(false);
              }}
            />
            <Button size="sm" variant="outline" className="h-7 px-2" onClick={handleAddTag}>
              Add
            </Button>
          </div>
        ) : (
          <>
            {taskDetails && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {taskDetails}
              </p>
            )}
            
            <p className="text-xs text-muted-foreground mt-0.5">
              Created {formatDistanceToNow(createdDate, { addSuffix: true })}
            </p>
          </>
        )}
      </div>
      
      {/* Add tag button that appears on hover */}
      {!showTagInput && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            setShowTagInput(true);
          }}
        >
          <Plus className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
