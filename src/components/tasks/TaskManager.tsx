
import React, { useEffect } from 'react';
import { TaskList } from './TaskList';
import { useTimerEvents } from '@/hooks/timer/useTimerEvents';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { eventBus } from '@/lib/eventBus';
import { useTagSystem } from '@/hooks/useTagSystem';

const TaskManager = () => {
  const { items: tasks, selected: selectedTaskId, completed: completedTasks } = useTaskContext();
  const { handleTimerStart } = useTimerEvents();
  const { addTagToEntity } = useTagSystem();

  useEffect(() => {
    const handleHabitSchedule = (event: any) => {
      const { habitId, templateId, name, duration, date } = event;
      
      console.log('TaskManager received habit:schedule event:', event);
      
      // Check if task already exists for this habit and date
      const existingTask = tasks.find(task => 
        task.relationships?.habitId === habitId && 
        task.relationships?.date === date
      );
      
      if (existingTask) {
        console.log(`Task already exists for habit ${habitId} on ${date}:`, existingTask);
        return;
      }

      const taskId = crypto.randomUUID();
      console.log(`Creating new task for habit ${habitId}:`, { taskId, name, duration });
      
      const task = {
        id: taskId,
        name,
        completed: false,
        duration,
        createdAt: new Date().toISOString(),
        relationships: {
          habitId,
          templateId,
          date
        }
      };

      // Create the task
      eventBus.emit('task:create', task);
      
      // Add the Habit tag
      addTagToEntity('Habit', taskId, 'task');

      // Create relationship
      eventBus.emit('relationship:create', {
        sourceId: habitId,
        sourceType: 'habit',
        targetId: taskId,
        targetType: 'task',
        relationType: 'habit-task'
      });
    };

    // Listen for habit scheduling
    const unsubscribe = eventBus.on('habit:schedule', handleHabitSchedule);
    
    return () => {
      unsubscribe();
    };
  }, [tasks, addTagToEntity]);

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      handleTimerStart(task.name, task.duration || 1500);
      eventBus.emit('task:select', taskId);
    }
  };

  const handleTaskDelete = (taskId: string) => {
    eventBus.emit('task:delete', { taskId, reason: 'manual' });
  };

  const handleTaskUpdate = (taskId: string, updates: any) => {
    eventBus.emit('task:update', { taskId, updates });
  };

  const handleActiveTasksClear = () => {
    tasks.forEach(task => {
      eventBus.emit('task:delete', { taskId: task.id, reason: 'manual' });
    });
  };

  const handleCompletedTasksClear = () => {
    completedTasks.forEach(task => {
      eventBus.emit('task:delete', { taskId: task.id, reason: 'completed' });
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
