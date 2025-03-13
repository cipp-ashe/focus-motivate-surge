
import React, { useState, useEffect } from 'react';
import { TaskManagerContent } from './TaskManagerContent';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { TaskEventListener } from './TaskEventListener';
import { TaskEventHandler } from './TaskEventHandler';

interface TaskManagerProps {
  isTimerView?: boolean;
  dialogOpeners?: {
    checklist: (taskId: string, taskName: string, items: any[]) => void;
    journal: (taskId: string, taskName: string, entry: string) => void;
    screenshot: (imageUrl: string, taskName: string) => void;
    voicenote: (taskId: string, taskName: string) => void;
  };
}

const TaskManager: React.FC<TaskManagerProps> = ({ isTimerView = false, dialogOpeners }) => {
  const { items, selected } = useTaskContext();
  
  console.log("TaskManager: Rendering with dialogOpeners available:", !!dialogOpeners);
  
  const handleTaskAdd = (task: Task) => {
    console.log("TaskManager: Adding task", task);
    eventBus.emit('task:create', task);
    
    // For timer view, automatically select the new task
    if (isTimerView) {
      setTimeout(() => {
        console.log("TaskManager: Auto-selecting newly created task in timer view", task.id);
        eventBus.emit('task:select', task.id);
      }, 100);
    }
  };
  
  const handleTasksAdd = (tasks: Task[]) => {
    console.log(`TaskManager: Adding ${tasks.length} tasks`);
    tasks.forEach(task => {
      eventBus.emit('task:create', task);
    });
    
    // For timer view, automatically select the first task
    if (isTimerView && tasks.length > 0) {
      setTimeout(() => {
        console.log("TaskManager: Auto-selecting first of multiple tasks in timer view", tasks[0].id);
        eventBus.emit('task:select', tasks[0].id);
      }, 100);
    }
  };
  
  // Handle task updates from dialogs
  const handleTaskUpdate = (data: { taskId: string; updates: Partial<Task> }) => {
    console.log("TaskManager: Updating task", data.taskId, data.updates);
    eventBus.emit('task:update', data);
  };

  // TaskEventHandler props
  const handleTaskCreate = (task: Task) => {
    console.log("TaskEventHandler: Task create", task);
  };

  const handleTaskDelete = (data: { taskId: string }) => {
    console.log("TaskEventHandler: Task delete", data);
  };

  const handleForceUpdate = () => {
    console.log("TaskEventHandler: Force update");
  };
  
  return (
    <>
      <TaskManagerContent
        tasks={items}
        selectedTaskId={selected}
        onTaskAdd={handleTaskAdd}
        onTasksAdd={handleTasksAdd}
        isTimerView={isTimerView}
        dialogOpeners={dialogOpeners}
      />
      
      <TaskEventHandler 
        tasks={items}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onForceUpdate={handleForceUpdate}
      />
    </>
  );
};

export default TaskManager;
