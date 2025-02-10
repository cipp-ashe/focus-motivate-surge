
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
  const durationInMinutes = task.duration ? Math.round(task.duration / 60) : 25;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-between gap-4">
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
      </div>

      <TaskTags 
        task={task}
        preventPropagation={preventPropagation}
      />
    </div>
  );
};
