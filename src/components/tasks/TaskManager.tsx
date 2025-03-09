
import React, { useEffect, useRef } from 'react';
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
  const { deleteTask, updateTask, checkPendingHabits } = useTaskEvents();
  const { currentPath } = useTasksNavigation();
  const initialCheckDoneRef = useRef(false);
  
  // Initialize task schedulers and get the check function
  const { checkForMissingHabitTasks } = useHabitTaskScheduler(tasks);
  useTemplateTasksManager(tasks);

  // Force tag update when task list changes
  useEffect(() => {
    if (tasks.length > 0) {
      console.log(`TaskManager: Task list updated with ${tasks.length} tasks`);
      eventBus.emit('task:tags-update', { count: tasks.length });
    }
  }, [tasks]);
  
  // Check for pending habits only once when TaskManager first mounts
  useEffect(() => {
    if (initialCheckDoneRef.current) return;
    
    console.log('TaskManager mounted, performing initial habits check');
    initialCheckDoneRef.current = true;
    
    // Check for pending habits on mount with a small delay
    const timeout = setTimeout(() => {
      checkPendingHabits();
      
      // Double-check after a slightly longer delay to catch any that might have been missed
      setTimeout(() => {
        checkForMissingHabitTasks();
        // Force localStorage sync and UI update
        window.dispatchEvent(new Event('force-task-update'));
      }, 300);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [checkPendingHabits, checkForMissingHabitTasks]);

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      handleTimerStart(task.name, task.duration || 1500);
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
