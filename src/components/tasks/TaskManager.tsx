import React, { useEffect, useState } from 'react';
import { TaskList } from './TaskList';
import { useTimerEvents } from '@/hooks/timer/useTimerEvents';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { useTagSystem } from '@/hooks/useTagSystem';
import { useTaskEvents } from '@/hooks/tasks/useTaskEvents';
import { useHabitTaskScheduler } from '@/hooks/tasks/useHabitTaskScheduler';
import { useTemplateTasksManager } from '@/hooks/tasks/useTemplateTasksManager';
import { useTasksNavigation } from '@/hooks/tasks/useTasksNavigation';
import { eventBus } from '@/lib/eventBus';

const TaskManager = () => {
  const { items: tasks, selected: selectedTaskId, completed: completedTasks } = useTaskContext();
  const { handleTimerStart } = useTimerEvents();
  const { getEntityTags } = useTagSystem();
  const [forceUpdate, setForceUpdate] = useState(0);
  const { currentPath } = useTasksNavigation();
  const { deleteTask, updateTask, forceTaskUpdate, forceTagsUpdate } = useTaskEvents();
  
  // Initialize task schedulers
  useHabitTaskScheduler(tasks);
  useTemplateTasksManager(tasks);

  // Force tag reloading when tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      console.log(`TaskManager: Tasks changed, force updating tags for ${tasks.length} tasks`);
      
      // Force tag update on all tasks
      setTimeout(() => {
        forceTagsUpdate();
      }, 100);
    }
  }, [tasks, forceTagsUpdate]);

  // Force rerender when needed
  useEffect(() => {
    const handleForceUpdate = () => {
      console.log("TaskManager: Force updating task list");
      setForceUpdate(prev => prev + 1);
      
      // Force tag update on all tasks
      setTimeout(() => {
        forceTagsUpdate();
      }, 100);
    };
    
    window.addEventListener('force-task-update', handleForceUpdate);
    
    // Also update when component mounts
    setForceUpdate(prev => prev + 1);
    
    return () => {
      window.removeEventListener('force-task-update', handleForceUpdate);
    };
  }, [forceTagsUpdate]);

  // Check for pending habit tasks on initial load
  useEffect(() => {
    setTimeout(() => {
      console.log('TaskManager: Initial load, checking for pending habit tasks');
      forceTaskUpdate();
      forceTagsUpdate();
    }, 200);
  }, [forceTaskUpdate, forceTagsUpdate]);

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      handleTimerStart(task.name, task.duration || 1500);
      // Use the task:select event
      eventBus.emit('task:select', taskId);
    }
  };

  const handleActiveTasksClear = () => {
    tasks.forEach(task => {
      deleteTask(task.id, 'manual');
    });
  };

  const handleCompletedTasksClear = () => {
    completedTasks.forEach(task => {
      deleteTask(task.id, 'completed');
    });
  };

  return (
    <TaskList
      tasks={tasks}
      selectedTasks={selectedTaskId ? [selectedTaskId] : []}
      onTaskClick={(task) => handleTaskClick(task.id)}
      onTaskDelete={(taskId) => deleteTask(taskId, 'manual')}
      onTasksUpdate={updateTask}
      onTasksClear={handleActiveTasksClear}
      onCompletedTasksClear={handleCompletedTasksClear}
    />
  );
};

export default TaskManager;
