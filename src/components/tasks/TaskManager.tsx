
import React from 'react';
import { TaskList } from './TaskList';
import { useTimerEvents } from '@/hooks/timer/useTimerEvents';
import { useTaskState, useTaskActions } from '@/contexts/tasks/TaskContext';
import { toast } from 'sonner';

const TaskManager = () => {
  const { items: tasks, selected: selectedTaskId, completed: completedTasks } = useTaskState();
  const actions = useTaskActions();
  const { handleTimerStart } = useTimerEvents();

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      handleTimerStart(task.name, task.duration || 1500);
      actions.selectTask(taskId);
    }
  };

  const handleTaskDelete = (taskId: string) => {
    actions.deleteTask(taskId);
  };

  const handleTaskUpdate = (taskId: string, updates: any) => {
    actions.updateTask(taskId, updates);
  };

  const handleTasksClear = () => {
    // Delete each completed task
    completedTasks.forEach(task => actions.deleteTask(task.id));
    toast.success('All completed tasks cleared!');
  };

  return (
    <TaskList
      tasks={tasks}
      selectedTasks={selectedTaskId ? [selectedTaskId] : []}
      onTaskClick={(task) => handleTaskClick(task.id)}
      onTaskDelete={handleTaskDelete}
      onTasksUpdate={handleTaskUpdate}
      onTasksClear={handleTasksClear}
    />
  );
};

export default TaskManager;
