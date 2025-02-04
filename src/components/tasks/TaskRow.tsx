import React from 'react';
import { Task } from './TaskList';

export interface TaskRowProps {
  task: Task;
  isSelected: boolean;
  editingTaskId?: string;
  onTaskClick: (task: Task, event: React.MouseEvent<HTMLDivElement>) => void;
  onTaskDelete: (taskId: string) => void;
  onDurationChange: (taskId: string, newDuration: string) => void;
  onDurationClick: (e: React.MouseEvent | React.TouchEvent, task: Task) => void;
  onSelect?: () => void;
  onUpdate?: (updatedTask: Task) => void;
}

const TaskRow: React.FC<TaskRowProps> = ({
  task,
  isSelected,
  editingTaskId,
  onTaskClick,
  onTaskDelete,
  onDurationChange,
  onDurationClick,
  onSelect,
  onUpdate
}) => {
  return (
    <div
      className={`flex justify-between items-center p-4 ${isSelected ? 'bg-gray-200' : ''}`}
      onClick={(e) => onTaskClick(task, e)}
    >
      <div>
        <h3 className="text-lg font-semibold">{task.name}</h3>
        <p className="text-sm text-gray-600">{task.description}</p>
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
