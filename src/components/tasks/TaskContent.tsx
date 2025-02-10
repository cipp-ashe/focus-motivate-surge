
import { Task } from "@/types/tasks";
import { TaskHeader } from "./TaskHeader";
import { TaskDuration } from "./TaskDuration";
import { TaskTags } from "./TaskTags";

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
  // Convert task duration from seconds to minutes, default to 25 if not set
  const durationInMinutes = task.duration ? Math.round(task.duration / 60) : 25;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <TaskHeader 
          task={task}
          onDelete={onDelete}
        />
        
        <TaskDuration
          durationInMinutes={durationInMinutes}
          isEditing={editingTaskId === task.id}
          inputValue={inputValue}
          onDurationClick={onDurationClick}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          preventPropagation={preventPropagation}
        />
      </div>

      <TaskTags 
        task={task}
        preventPropagation={preventPropagation}
      />
    </div>
  );
};

