import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { useTaskSelection } from './providers/TaskSelectionProvider';
import { logger } from '@/utils/logManager';
import { PlusIcon, PlayIcon } from 'lucide-react';
import { createTaskOperations } from '@/lib/operations/tasks/create';

export const TimerTaskInput = () => {
  const [taskName, setTaskName] = useState('');
  const { addTask } = useTaskContext();
  const { selectTask } = useTaskSelection();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTimerTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName.trim()) {
      toast.error('Please enter a task name');
      return;
    }

    setIsSubmitting(true);
    logger.debug('TimerTaskInput', `Creating timer task: ${taskName}`);

    try {
      // Create a new timer task with default 25 minutes
      const newTask = createTaskOperations.createTask(
        {
          name: taskName,
          taskType: 'timer',
          duration: 1500, // 25 minutes in seconds
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          suppressToast: true,
          selectAfterCreate: false,
        }
      );

      // Clear input
      setTaskName('');

      // Show success message
      toast.success(`Timer task created: ${newTask.name}`);

      // Immediately select the new task
      selectTask(newTask);

      logger.debug('TimerTaskInput', `Timer task created and selected: ${newTask.id}`);
    } catch (error) {
      logger.error('TimerTaskInput', 'Error creating timer task:', error);
      toast.error('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleCreateTimerTask} className="mb-4 flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Add a new timer task..."
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="flex-1 bg-card/30 border-border/30 py-2 text-base"
        />
      </div>
      <Button
        type="submit"
        disabled={isSubmitting || !taskName.trim()}
        className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
      >
        <PlusIcon className="h-4 w-4 mr-1" />
        <span className="sr-only md:not-sr-only md:inline">Add</span>
      </Button>
    </form>
  );
};
