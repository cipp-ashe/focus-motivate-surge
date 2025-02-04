import React from 'react';
import { Task } from './TaskList';

export interface TaskRowProps {
  task: Task;
  isSelected: boolean;
  editingTaskId?: string | null;
  onTaskClick: (task: Task, event: React.MouseEvent<HTMLDivElement>) => void;
  onTaskDelete: (taskId: string) => void;
  onDurationChange: (taskId: string, newDuration: string) => void;
  onDurationClick: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>, task: Task) => void;
  onInputBlur?: () => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  isSelected,
  editingTaskId,
  onTaskClick,
  onTaskDelete,
  onDurationChange,
  onDurationClick,
  onInputBlur
}) => {
  return (
    <div
      className={`flex justify-between items-center p-4 ${isSelected ? 'bg-gray-200' : ''}`}
      onClick={(e) => onTaskClick(task, e)}
    >
      <div>
        <h3 className="text-lg font-semibold">{task.name}</h3>
      </div>
      <div className="flex items-center">
        <button onClick={() => onDurationChange(task.id, task.duration.toString())}>
          Change Duration
        </button>
        <button onClick={() => onTaskDelete(task.id)} className="ml-2 text-red-500">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskRow;