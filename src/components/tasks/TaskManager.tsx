
import React, { useCallback, useState } from 'react';
import { TaskManagerContent } from './TaskManagerContent';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { TaskEventHandler } from './event-handlers/TaskEventHandler';
import { Task } from '@/types/tasks';

interface TaskManagerProps {
  isTimerView?: boolean;
  dialogOpeners?: {
    checklist: (taskId: string, taskName: string, items: any[]) => void;
    journal: (taskId: string, taskName: string, entry: string) => void;
    screenshot: (imageUrl: string, taskName: string) => void;
    voicenote: (taskId: string, taskName: string) => void;
  };
}

const TaskManager: React.FC<TaskManagerProps> = ({
  isTimerView = false,
  dialogOpeners
}) => {
  const { items: tasks, completed: completedTasks, selected: selectedTaskId, addTask } = useTaskContext();
  
  // Task management functionality
  const handleTaskAdd = useCallback((task: Task) => {
    addTask(task);
  }, [addTask]);
  
  const handleTasksAdd = useCallback((tasks: Task[]) => {
    tasks.forEach(task => addTask(task));
  }, [addTask]);
  
  // Force refresh handler to be passed to event handler
  const forceUpdate = useCallback(() => {
    console.log("TaskManager: Force update called - triggering UI refresh");
    window.dispatchEvent(new CustomEvent('task-ui-refresh'));
  }, []);
  
  return (
    <div className="space-y-4">
      <TaskEventHandler onForceUpdate={forceUpdate} />
      
      <TaskManagerContent
        tasks={tasks}
        completedTasks={completedTasks}
        selectedTaskId={selectedTaskId}
        isTimerView={isTimerView}
        dialogOpeners={dialogOpeners}
        onTaskAdd={handleTaskAdd}
        onTasksAdd={handleTasksAdd}
      />
    </div>
  );
};

export default TaskManager;
