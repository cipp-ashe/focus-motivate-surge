
import React from 'react';
import { Task } from "@/types/tasks";
import {
  TimerButton,
  JournalButton,
  ScreenshotButton,
  ChecklistButton,
  VoiceNoteButton,
  HabitButton,
  StatusDropdownMenu
} from './buttons';

interface TaskActionButtonProps {
  task: Task;
  editingTaskId: string | null;
  inputValue: string;
  durationInMinutes: number;
  onTaskAction: (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLElement>, actionType?: string) => void;
  handleLocalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLocalBlur: () => void;
  handleLocalKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  preventPropagation: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
  onOpenTaskDialog?: () => void; // The dialog opener function
}

export const TaskActionButton: React.FC<TaskActionButtonProps> = ({
  task,
  editingTaskId,
  inputValue,
  durationInMinutes,
  onTaskAction,
  handleLocalChange,
  handleLocalBlur,
  handleLocalKeyDown,
  preventPropagation,
  onOpenTaskDialog,
}) => {
  // For habit-related tasks
  if (task.relationships?.habitId) {
    return (
      <div className="flex items-center gap-2">
        {getTaskTypeButton()}
        <HabitButton onClick={(e) => onTaskAction(e, 'view-habit')} />
        <StatusDropdownMenu task={task} onTaskAction={onTaskAction} />
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      {getTaskTypeButton()}
      <StatusDropdownMenu task={task} onTaskAction={onTaskAction} />
    </div>
  );

  function getTaskTypeButton() {
    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLElement>) => {
      console.log(`${task.taskType} button clicked for task:`, task.id);
      onTaskAction(e, 'true');
      
      if (onOpenTaskDialog) {
        console.log(`Calling onOpenTaskDialog from ${task.taskType} button`);
        onOpenTaskDialog();
      } else {
        console.warn(`No dialog opener provided for ${task.taskType} task:`, task.id);
      }
    };

    // Handle timer button separately because it has different behavior
    if (task.taskType === 'timer') {
      return (
        <TimerButton
          durationInMinutes={durationInMinutes}
          isEditing={editingTaskId === task.id}
          inputValue={inputValue}
          handleChange={handleLocalChange}
          handleBlur={handleLocalBlur}
          handleKeyDown={handleLocalKeyDown}
          preventPropagation={preventPropagation}
          onClick={(e) => onTaskAction(e, 'true')}
        />
      );
    }
    
    if (task.taskType === 'journal') {
      return (
        <JournalButton 
          hasEntry={!!task.journalEntry} 
          onClick={handleButtonClick}
        />
      );
    }
    
    if (task.taskType === 'screenshot') {
      return (
        <ScreenshotButton 
          hasImage={!!task.imageUrl} 
          onClick={handleButtonClick}
        />
      );
    }
    
    if (task.taskType === 'checklist') {
      return (
        <ChecklistButton 
          hasItems={!!(task.checklistItems?.length)} 
          onClick={handleButtonClick}
        />
      );
    }
    
    if (task.taskType === 'voicenote') {
      return (
        <VoiceNoteButton 
          hasRecording={!!task.voiceNoteUrl} 
          onClick={handleButtonClick}
        />
      );
    }
    
    // If there's no specific action type, we don't need a button
    return null;
  }
};
