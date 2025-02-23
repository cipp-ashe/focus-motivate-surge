
import React from 'react';
import { TaskList } from './TaskList';
import { useTimerEvents } from '@/hooks/timer/useTimerEvents';
import { useTaskState, useTaskActions } from '@/contexts/tasks/TaskContext';

const TaskManager = () => {
  const { items: tasks, selected: selectedTaskId } = useTaskState();
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
    tasks.forEach(task => actions.deleteTask(task.id));
  };

  return (
    <div className="flex flex-col space-y-4">
      <TaskList
        tasks={tasks}
        selectedTasks={selectedTaskId ? [selectedTaskId] : []}
        onTaskClick={(task) => handleTaskClick(task.id)}
        onTaskDelete={handleTaskDelete}
        onTasksUpdate={handleTaskUpdate}
        onTasksClear={handleTasksClear}
      />
    </div>
  );
};

export default TaskManager;
