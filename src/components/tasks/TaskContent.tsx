
import React, { useState, useEffect } from 'react';
import { Task } from "@/types/tasks";
import { eventBus } from "@/lib/eventBus";
import { eventManager } from "@/lib/events/EventManager";
import { toast } from "sonner";
import { TaskHeader } from "./components/TaskHeader";
import { TaskTags } from "./TaskTags";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScreenshotContent } from "@/components/screenshots/components/ScreenshotContent";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";

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
  const [isScreenshotDialogOpen, setIsScreenshotDialogOpen] = useState(false);
  const [isScreenshotExpanded, setIsScreenshotExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [editedDescription, setEditedDescription] = useState(task.description || "");
  
  useEffect(() => {
    if (editingTaskId === task.id) {
      setLocalInputValue(inputValue);
    }
  }, [inputValue, editingTaskId, task.id]);

  useEffect(() => {
    // Reset editing state and update edited values when dialog opens/closes
    if (isScreenshotDialogOpen) {
      setEditedName(task.name);
      setEditedDescription(task.description || "");
      setIsEditing(false);
    }
  }, [isScreenshotDialogOpen, task.name, task.description]);

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setLocalInputValue(value);
      onChange(e);
    }
  };

  const handleLocalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
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
    
    setLocalInputValue(finalValue);
    const syntheticEvent = {
      target: { value: finalValue }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    onBlur();
  };

  const handleTaskAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (task.relationships?.habitId) {
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
        eventManager.emit('timer:init', { 
          taskName: task.name, 
          duration: task.duration || 1500 
        });
        break;
        
      case 'journal':
        const openJournalEvent = new CustomEvent('open-journal', {
          detail: { taskId: task.id, taskName: task.name, entry: task.journalEntry }
        });
        window.dispatchEvent(openJournalEvent);
        break;
        
      case 'screenshot':
        if (task.imageUrl) {
          // Open dialog instead of dispatching an event
          setIsScreenshotDialogOpen(true);
        } else {
          toast.error(`No image found for task: ${task.name}`);
        }
        break;
        
      case 'checklist':
        const itemsToPass = task.checklistItems || [];
        
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
        const openVoiceRecorderEvent = new CustomEvent('open-voice-recorder', {
          detail: { taskId: task.id, taskName: task.name }
        });
        window.dispatchEvent(openVoiceRecorderEvent);
        break;
        
      default:
        eventBus.emit('task:complete', { taskId: task.id });
        toast.success(`Completed task: ${task.name}`);
        break;
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (task.relationships?.habitId) {
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

  const handleSaveEdit = () => {
    if (!editedName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    const updates = {
      name: editedName.trim(),
      description: editedDescription.trim() || undefined
    };

    eventBus.emit('task:update', { 
      taskId: task.id, 
      updates 
    });

    setIsEditing(false);
    toast.success("Screenshot details updated");
  };

  const handleCancelEdit = () => {
    setEditedName(task.name);
    setEditedDescription(task.description || "");
    setIsEditing(false);
  };

  return (
    <>
      <div className="flex flex-col gap-2 p-4">
        <TaskHeader 
          task={task}
          editingTaskId={editingTaskId}
          inputValue={localInputValue}
          onDelete={handleDelete}
          onTaskAction={handleTaskAction}
          handleLocalChange={handleLocalChange}
          handleLocalBlur={handleLocalBlur}
          handleLocalKeyDown={handleLocalKeyDown}
          preventPropagation={preventPropagation}
        />

        {task.tags && (
          <TaskTags 
            tags={task.tags}
            preventPropagation={preventPropagation}
          />
        )}
      </div>

      {/* Screenshot Dialog */}
      {task.taskType === 'screenshot' && (
        <Dialog open={isScreenshotDialogOpen} onOpenChange={setIsScreenshotDialogOpen}>
          <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
            <DialogHeader className="flex flex-col space-y-1.5 pb-2">
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Screenshot name"
                    className="font-medium"
                    autoFocus
                  />
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    placeholder="Add a description"
                    className="min-h-[60px] text-sm"
                  />
                </div>
              ) : (
                <DialogTitle className="text-xl">{task.name}</DialogTitle>
              )}
              
              {/* Edit/Save buttons */}
              <div className="flex justify-end space-x-2 mt-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="text-xs h-8"
                      onClick={handleSaveEdit}
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </DialogHeader>
            
            {!isEditing && task.description && (
              <p className="text-sm text-muted-foreground px-1 -mt-1 mb-4">
                {task.description}
              </p>
            )}
            
            <div className="mt-2">
              <ScreenshotContent 
                task={task}
                isExpanded={isScreenshotExpanded}
                setIsExpanded={setIsScreenshotExpanded}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
