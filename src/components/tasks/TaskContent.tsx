
import { Task } from "./TaskList";
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
  const durationInMinutes = Math.round(Number(task.duration || 1500) / 60);

  return (
    <>
      <TaskHeader 
        task={task}
        onDelete={onDelete}
      />
      
      <div className="flex items-center justify-between">
        <TaskTags 
          task={task}
          preventPropagation={preventPropagation}
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
    </>
  );
};
