
import React, { useState } from 'react';
import { Task } from "@/types/tasks";
import { TaskHeader } from "./components/TaskHeader";
import { TaskTags } from "./TaskTags";
import { ScreenshotDialog } from './components/ScreenshotDialog';
import { JournalDialog } from './components/JournalDialog';
import { ChecklistDialog } from './components/ChecklistDialog';
import { VoiceNoteDialog } from './components/VoiceNoteDialog';
import { useInputDurationHandler } from '@/hooks/tasks/useInputDurationHandler';
import { useTaskActionHandler } from './components/TaskActionHandler';

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
  const [isScreenshotDialogOpen, setIsScreenshotDialogOpen] = useState(false);
  const [isJournalDialogOpen, setIsJournalDialogOpen] = useState(false);
  const [isChecklistDialogOpen, setIsChecklistDialogOpen] = useState(false);
  const [isVoiceNoteDialogOpen, setIsVoiceNoteDialogOpen] = useState(false);
  
  // Use the input duration handler
  const { 
    localInputValue, 
    handleLocalChange, 
    handleLocalBlur, 
    handleLocalKeyDown 
  } = useInputDurationHandler({
    editingTaskId,
    taskId: task.id,
    inputValue,
    onChange,
    onBlur,
    onKeyDown
  });

  // Use the task action handler with dialog open callbacks
  const { handleTaskAction, handleDelete } = useTaskActionHandler(
    task, 
    () => {
      switch(task.taskType) {
        case 'screenshot':
          setIsScreenshotDialogOpen(true);
          break;
        case 'journal':
          setIsJournalDialogOpen(true);
          break;
        case 'checklist':
          setIsChecklistDialogOpen(true);
          break;
        case 'voicenote':
          setIsVoiceNoteDialogOpen(true);
          break;
      }
    }
  );

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

      {/* Task-specific dialogs */}
      {task.taskType === 'screenshot' && (
        <ScreenshotDialog
          task={task}
          isOpen={isScreenshotDialogOpen}
          setIsOpen={setIsScreenshotDialogOpen}
        />
      )}
      
      {task.taskType === 'journal' && (
        <JournalDialog
          task={task}
          isOpen={isJournalDialogOpen}
          setIsOpen={setIsJournalDialogOpen}
        />
      )}
      
      {task.taskType === 'checklist' && (
        <ChecklistDialog
          task={task}
          isOpen={isChecklistDialogOpen}
          setIsOpen={setIsChecklistDialogOpen}
        />
      )}
      
      {task.taskType === 'voicenote' && (
        <VoiceNoteDialog
          task={task}
          isOpen={isVoiceNoteDialogOpen}
          setIsOpen={setIsVoiceNoteDialogOpen}
        />
      )}
    </>
  );
};
