
import React, { useState } from 'react';
import { Task } from "@/types/tasks";
import { TaskHeader } from "./components/TaskHeader";
import { TaskTags } from "./TaskTags";
import { ScreenshotDialog } from './components/ScreenshotDialog';
import { InputDurationHandler } from './components/InputDurationHandler';
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
  
  // Use the input duration handler
  const { 
    localInputValue, 
    handleLocalChange, 
    handleLocalBlur, 
    handleLocalKeyDown 
  } = InputDurationHandler({
    editingTaskId,
    taskId: task.id,
    inputValue,
    onChange,
    onBlur,
    onKeyDown
  });

  // Use the task action handler
  const { handleTaskAction, handleDelete } = useTaskActionHandler(
    task, 
    () => setIsScreenshotDialogOpen(true)
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

      {/* Screenshot Dialog */}
      {task.taskType === 'screenshot' && (
        <ScreenshotDialog
          task={task}
          isOpen={isScreenshotDialogOpen}
          setIsOpen={setIsScreenshotDialogOpen}
        />
      )}
    </>
  );
};
