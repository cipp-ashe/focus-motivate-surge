
import React, { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { Check, Clock, Trash, Edit } from 'lucide-react';

interface TaskTaskProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export const TaskTask: React.FC<TaskTaskProps> = ({ task, onEdit }) => {
  // Handler for completing a task
  const handleComplete = useCallback(() => {
    eventManager.emit('task:complete', { taskId: task.id });
    toast.success(`Task completed: ${task.name}`);
  }, [task]);

  // Handler for deleting a task
  const handleDelete = useCallback(() => {
    eventManager.emit('task:delete', { taskId: task.id });
    toast.success(`Task deleted: ${task.name}`);
  }, [task]);

  // Handler for setting a task for the timer
  const handleSetForTimer = useCallback(() => {
    eventManager.emit('timer:set-task', { 
      id: task.id, 
      name: task.name 
    });
    toast.success(`Timer set for: ${task.name}`);
  }, [task]);

  // Handler for editing a task
  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit(task);
    }
  }, [task, onEdit]);

  return (
    <div className="flex items-center justify-between p-3 border-b">
      <div className="flex-1">
        <h3 className="font-medium">{task.name}</h3>
        {task.description && (
          <p className="text-sm text-gray-500">{task.description}</p>
        )}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleEdit}
          className="p-2 text-gray-500 hover:text-gray-700"
          aria-label="Edit task"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={handleSetForTimer}
          className="p-2 text-gray-500 hover:text-blue-600"
          aria-label="Set for timer"
        >
          <Clock size={16} />
        </button>
        <button
          onClick={handleComplete}
          className="p-2 text-gray-500 hover:text-green-600"
          aria-label="Complete task"
        >
          <Check size={16} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-gray-500 hover:text-red-600"
          aria-label="Delete task"
        >
          <Trash size={16} />
        </button>
      </div>
    </div>
  );
};
