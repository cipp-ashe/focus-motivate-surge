import React, { useState } from 'react';
import { Task } from "@/types/tasks";
import { eventBus } from "@/lib/eventBus";
import { eventManager } from "@/lib/events/EventManager";
import { toast } from "sonner";

interface TaskContentProps {
  task: Task;
  editingTaskId: string | null;
  inputValue: string;
  onDelete: (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void;
  onDurationClick: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  preventPropagation: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
}

export const TaskContent = ({
  task,
  editingTaskId,
  inputValue,
  onDelete,
  onDurationClick,
  onChange,
  onBlur,
  onKeyDown,
  preventPropagation,
}: TaskContentProps) => {
  const [localInputValue, setLocalInputValue] = useState(inputValue);
  
  useEffect(() => {
    if (editingTaskId === task.id) {
      setLocalInputValue(inputValue);
    }
  }, [inputValue, editingTaskId, task.id]);

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      console.log('Handling duration change:', value);
      setLocalInputValue(value);
      onChange(e);
    }
  };

  const handleLocalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed, handling blur');
      e.currentTarget.blur();
    }
    onKeyDown(e);
  };

  const handleLocalBlur = () => {
    let finalValue = localInputValue;
    if (finalValue === '' || isNaN(parseInt(finalValue, 10))) {
      finalValue = '25';
    } else {
      const numValue = parseInt(finalValue, 10);
      finalValue = Math.min(Math.max(numValue, 1), 60).toString();
    }
    
    console.log('Handling blur with final value:', finalValue);
    setLocalInputValue(finalValue);
    const syntheticEvent = {
      target: { value: finalValue }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    onBlur();
  };

  const handleTaskAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(`Task action clicked for ${task.name} (${task.taskType})`);
    e.stopPropagation();
    e.preventDefault();
    
    if (task.relationships?.habitId) {
      console.log("This is a habit-related task with ID:", task.relationships.habitId);
      
      if (e.currentTarget.getAttribute('data-action-type') === 'view-habit') {
        if (task.relationships?.habitId) {
          window.location.href = `/habits?habitId=${task.relationships.habitId}`;
        } else {
          toast.info(`Viewing habit task: ${task.name}`);
        }
        return;
      }
    }
    
    switch(task.taskType) {
      case 'timer':
        console.log("Dispatching timer:init event");
        eventManager.emit('timer:init', { 
          taskName: task.name, 
          duration: task.duration || 1500 
        });
        break;
        
      case 'journal':
        console.log("Dispatching custom open-journal event for", task.id, task.name);
        
        const openJournalEvent = new CustomEvent('open-journal', {
          detail: { taskId: task.id, taskName: task.name, entry: task.journalEntry }
        });
        window.dispatchEvent(openJournalEvent);
        break;
        
      case 'screenshot':
        console.log("Handling screenshot view");
        if (task.imageUrl) {
          const showImageEvent = new CustomEvent('show-image', {
            detail: { imageUrl: task.imageUrl, taskName: task.name }
          });
          window.dispatchEvent(showImageEvent);
        } else {
          toast.error(`No image found for task: ${task.name}`);
        }
        break;
        
      case 'checklist':
        console.log('Opening checklist for task:', task.id, task.name);
        
        const itemsToPass = task.checklistItems || [];
        console.log('Checklist items:', itemsToPass);
        
        const openChecklistEvent = new CustomEvent('open-checklist', {
          detail: { 
            taskId: task.id, 
            taskName: task.name, 
            items: itemsToPass
          }
        });
        window.dispatchEvent(openChecklistEvent);
        break;
        
      case 'voicenote':
        console.log("Dispatching open-voice-recorder event");
        const openVoiceRecorderEvent = new CustomEvent('open-voice-recorder', {
          detail: { taskId: task.id, taskName: task.name }
        });
        window.dispatchEvent(openVoiceRecorderEvent);
        break;
        
      default:
        console.log("Completing regular task");
        eventBus.emit('task:complete', { taskId: task.id });
        toast.success(`Completed task: ${task.name}`);
        break;
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (task.relationships?.habitId) {
      console.log('Dismissing habit task rather than deleting:', task.id);
      
      eventBus.emit('task:dismiss', { 
        taskId: task.id, 
        habitId: task.relationships.habitId,
        date: task.relationships.date || new Date().toDateString() 
      });
      
      toast.success(`Dismissed habit task for today: ${task.name}`, {
        description: "You won't see this habit task today"
      });
    } else {
      eventBus.emit('task:delete', { taskId: task.id, reason: 'manual' });
    }
  };

  const durationInMinutes = Math.round((task.duration || 1500) / 60);
  
  const getTaskActionButton = () => {
    if (task.relationships?.habitId) {
      return (
        <div className="flex items-center gap-2">
          {getStandardActionButton()}
          <Button
            variant="outline"
            size="sm"
            onClick={handleTaskAction}
            className="h-7 px-2 flex items-center gap-1 text-xs bg-green-500/10 hover:bg-green-500/20 text-green-500"
            data-action="true"
            data-action-type="view-habit"
          >
            <Zap className="h-3.5 w-3.5 text-green-500" />
            <span>View Habit</span>
          </Button>
        </div>
      );
    }
    
    return getStandardActionButton();
  };

  const getStandardActionButton = () => {
    if (task.taskType === 'timer') {
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-primary/5 hover:bg-primary/10">
          <Clock className="h-3.5 w-3.5 text-primary opacity-70" />
          {editingTaskId === task.id ? (
            <Input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              value={localInputValue}
              className="w-12 text-right bg-transparent border-0 focus:ring-0 p-0 h-auto [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              onChange={handleLocalChange}
              onBlur={handleLocalBlur}
              onKeyDown={handleLocalKeyDown}
              autoFocus
              onClick={preventPropagation}
              onTouchStart={preventPropagation}
              data-action="true"
            />
          ) : (
            <span 
              className="w-8 text-right text-primary cursor-text"
              onClick={onDurationClick}
              onTouchStart={onDurationClick}
              data-action="true"
            >
              {durationInMinutes}
            </span>
          )}
          <span className="text-primary/70 text-sm">m</span>
        </Badge>
      );
    }
    
    if (task.taskType === 'journal') {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={handleTaskAction}
          className="h-7 px-2 flex items-center gap-1 text-xs"
          data-action="true"
        >
          <BookOpen className="h-3.5 w-3.5 text-amber-400" />
          <span>Write</span>
        </Button>
      );
    }
    
    if (task.taskType === 'screenshot') {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={handleTaskAction}
          className="h-7 px-2 flex items-center gap-1 text-xs"
          data-action="true"
        >
          <Image className="h-3.5 w-3.5 text-blue-400" />
          <span>View</span>
        </Button>
      );
    }
    
    if (task.taskType === 'checklist') {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={handleTaskAction}
          className="h-7 px-2 flex items-center gap-1 text-xs"
          data-action="true"
        >
          <CheckSquare className="h-3.5 w-3.5 text-cyan-400" />
          <span>Checklist</span>
        </Button>
      );
    }
    
    if (task.taskType === 'voicenote') {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={handleTaskAction}
          className="h-7 px-2 flex items-center gap-1 text-xs"
          data-action="true"
        >
          <Mic className="h-3.5 w-3.5 text-rose-400" />
          <span>Record</span>
        </Button>
      );
    }
    
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleTaskAction}
        className="h-7 px-2 flex items-center gap-1 text-xs"
        data-action="true"
      >
        <CheckSquare className="h-3.5 w-3.5 text-green-500" />
        <span>Complete</span>
      </Button>
    );
  };

  const getTaskIcon = () => {
    switch(task.taskType) {
      case 'timer':
        return <Clock className="h-4 w-4 text-purple-400" />;
      case 'screenshot':
        return <Image className="h-4 w-4 text-blue-400" />;
      case 'journal':
        return <BookOpen className="h-4 w-4 text-amber-400" />;
      case 'checklist':
        return <CheckSquare className="h-4 w-4 text-cyan-400" />;
      case 'voicenote':
        return <Mic className="h-4 w-4 text-rose-400" />;
      default:
        return <Sparkles className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between w-full gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="rounded-full bg-primary/10 p-1.5">
            {getTaskIcon()}
          </div>
          <span className="text-foreground line-clamp-1 flex-1 font-medium">
            {task.name}
            {task.relationships?.habitId && (
              <Badge variant="outline" className="ml-2 text-xs bg-green-500/10 text-green-500">
                Habit
              </Badge>
            )}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {getTaskActionButton()}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            onTouchStart={handleDelete}
            className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors duration-200 touch-manipulation hover:bg-destructive/10"
            data-action="true"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {task.tags && (
        <TaskTags 
          tags={task.tags}
          preventPropagation={preventPropagation}
        />
      )}
    </div>
  );
};
