
import React from 'react';
import { TaskList } from './TaskList';
import { useTimerEvents } from '@/hooks/timer/useTimerEvents';
import { useTaskState } from '@/contexts/tasks/TaskContext';
import { eventBus } from '@/lib/eventBus';

const TaskManager = () => {
  const { items: tasks, selected: selectedTaskId, completed: completedTasks } = useTaskState();
  const { handleTimerStart } = useTimerEvents();

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      handleTimerStart(task.name, task.duration || 1500);
      eventBus.emit('task:select', taskId);
    }
  };

  const handleTaskDelete = (taskId: string) => {
    eventBus.emit('task:delete', taskId);
  };

  const handleTaskUpdate = (taskId: string, updates: any) => {
    eventBus.emit('task:update', { taskId, updates });
  };

  const handleActiveTasksClear = () => {
    tasks.forEach(task => {
      eventBus.emit('task:delete', task.id);
    });
  };

  const handleCompletedTasksClear = () => {
    completedTasks.forEach(task => {
      eventBus.emit('task:delete', task.id);
    });
  };

  return (
    <TaskList
      tasks={tasks}
      selectedTasks={selectedTaskId ? [selectedTaskId] : []}
      onTaskClick={(task) => handleTaskClick(task.id)}
      onTaskDelete={handleTaskDelete}
      onTasksUpdate={handleTaskUpdate}
      onTasksClear={handleActiveTasksClear}
      onCompletedTasksClear={handleCompletedTasksClear}
    />
  );
};

export default TaskManager;
