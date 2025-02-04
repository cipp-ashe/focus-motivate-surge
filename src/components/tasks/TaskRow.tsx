import { Task } from "./TaskList";

export interface TaskRowProps {
  task: Task;
  onSelect?: () => void;
  onUpdate: (updatedTask: Task) => void;
  isSelected: boolean;
}

const TaskRow: React.FC<TaskRowProps> = ({ task, onSelect, onUpdate, isSelected }) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect();
    }
  };

  const handleUpdate = () => {
    onUpdate(task);
  };

  return (
    <div
      className={`task-row ${isSelected ? 'selected' : ''}`}
      onClick={handleSelect}
    >
      <div className="task-name">{task.name}</div>
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default TaskRow;
