import React, { useEffect, useRef, useState } from 'react';
import { TaskList } from './TaskList';
import { useTimerEvents } from '@/hooks/timer/useTimerEvents';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { eventBus } from '@/lib/eventBus';
import { useTagSystem } from '@/hooks/useTagSystem';
import { useLocation } from 'react-router-dom';

const TaskManager = () => {
  const { items: tasks, selected: selectedTaskId, completed: completedTasks } = useTaskContext();
  const { handleTimerStart } = useTimerEvents();
  const { addTagToEntity, getEntityTags } = useTagSystem();
  const scheduledTasksRef = useRef(new Map<string, string>()); // Map habitId-date to taskId
  const processingEventRef = useRef(false);
  const location = useLocation();
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force tag reloading when tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      console.log(`TaskManager: Tasks changed, force updating tags for ${tasks.length} tasks`);
      
      // Force tag update on all tasks
      setTimeout(() => {
        window.dispatchEvent(new Event('force-tags-update'));
      }, 100);
    }
  }, [tasks]);

  // Force rerender when needed or when location changes
  useEffect(() => {
    const handleForceUpdate = () => {
      console.log("TaskManager: Force updating task list");
      setForceUpdate(prev => prev + 1);
      
      // Force tag update on all tasks
      setTimeout(() => {
        window.dispatchEvent(new Event('force-tags-update'));
      }, 100);
    };
    
    window.addEventListener('force-task-update', handleForceUpdate);
    
    // Also update when location changes (navigating back from habits page)
    setForceUpdate(prev => prev + 1);
    console.log("TaskManager: Location changed to", location.pathname);
    
    // When returning from /habits to / root, force an immediate tag update
    if (location.pathname === '/') {
      console.log("TaskManager: Returned to home page, forcing task and tag update");
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
        window.dispatchEvent(new Event('force-tags-update'));
      }, 50);
    }
    
    return () => {
      window.removeEventListener('force-task-update', handleForceUpdate);
    };
  }, [location]);

  useEffect(() => {
    const handleHabitSchedule = (event: any) => {
      // Prevent concurrent processing of events
      if (processingEventRef.current) {
        console.log('TaskManager: Already processing a habit:schedule event, deferring');
        setTimeout(() => eventBus.emit('habit:schedule', event), 100);
        return;
      }
      
      processingEventRef.current = true;
      
      try {
        const { habitId, templateId, name, duration, date } = event;
        
        console.log('TaskManager received habit:schedule event:', event);
        
        // Create a unique key to track this scheduled task
        const taskKey = `${habitId}-${date}`;
        
        // Check if we've already processed this exact habit-date combination
        if (scheduledTasksRef.current.has(taskKey)) {
          const existingTaskId = scheduledTasksRef.current.get(taskKey);
          console.log(`Task already scheduled for habit ${habitId} on ${date}, taskId: ${existingTaskId}`);
          return;
        }
        
        // Check if task already exists for this habit and date
        const existingTask = tasks.find(task => 
          task.relationships?.habitId === habitId && 
          task.relationships?.date === date
        );
        
        if (existingTask) {
          console.log(`Task already exists for habit ${habitId} on ${date}:`, existingTask);
          scheduledTasksRef.current.set(taskKey, existingTask.id);
          return;
        }

        const taskId = crypto.randomUUID();
        console.log(`Creating new task for habit ${habitId}:`, { taskId, name, duration });
        
        // Add to our tracking map
        scheduledTasksRef.current.set(taskKey, taskId);
        
        // Ensure we're storing the duration in seconds
        const durationInSeconds = duration;
        
        const task = {
          id: taskId,
          name,
          completed: false,
          duration: durationInSeconds, // Store in seconds
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
        
        // Add template tag if available (e.g., "Mindfulness")
        if (templateId) {
          // Format template name correctly with first letter capitalized
          // Handles both camelCase and kebab-case formats
          let templateName = '';
          
          if (templateId.includes('-')) {
            // Handle kebab-case: "morning-routine" -> "Morning Routine"
            templateName = templateId
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
          } else {
            // Handle camelCase: "morningRoutine" -> "Morning Routine"
            templateName = templateId
              // Insert a space before all capital letters
              .replace(/([A-Z])/g, ' $1')
              // Capitalize the first letter
              .replace(/^./, str => str.toUpperCase())
              .trim();
          }
          
          console.log(`Adding template tag "${templateName}" to task ${taskId}`);
          addTagToEntity(templateName, taskId, 'task');
        }

        // Create relationship
        eventBus.emit('relationship:create', {
          sourceId: habitId,
          sourceType: 'habit',
          targetId: taskId,
          targetType: 'task',
          relationType: 'habit-task'
        });
        
        // Force a UI update
        setTimeout(() => {
          window.dispatchEvent(new Event('force-task-update'));
        }, 50);
      } finally {
        // Release the lock after a short delay to prevent race conditions
        setTimeout(() => {
          processingEventRef.current = false;
        }, 50);
      }
    };

    // Handle template deletion - clean up associated tasks
    const handleTemplateDelete = (event: any) => {
      const { templateId } = event;
      console.log(`TaskManager received template deletion event for ${templateId}`);
      
      // Find all tasks related to this template
      const tasksToRemove = tasks.filter(task => 
        task.relationships?.templateId === templateId
      );
      
      if (tasksToRemove.length === 0) {
        console.log(`No tasks found for template ${templateId}`);
        return;
      }
      
      console.log(`Found ${tasksToRemove.length} tasks to remove for template ${templateId}`);
      
      // Delete each task associated with the deleted template
      tasksToRemove.forEach(task => {
        console.log(`Removing task ${task.id} associated with deleted template ${templateId}`);
        eventBus.emit('task:delete', { taskId: task.id, reason: 'template-removed' });
        
        // Also remove from our tracking map
        if (task.relationships?.habitId && task.relationships?.date) {
          const taskKey = `${task.relationships.habitId}-${task.relationships.date}`;
          scheduledTasksRef.current.delete(taskKey);
        }
      });
      
      // Force a UI update after deleting tasks
      setTimeout(() => {
        console.log('TaskManager: Forcing task list update after template removal');
        window.dispatchEvent(new Event('force-task-update'));
      }, 100);
    };

    // Handler for task deletion at a lower level
    const handleTaskDelete = ({ taskId, reason }: { taskId: string, reason: string }) => {
      // Find the task
      const task = tasks.find(t => t.id === taskId);
      if (!task || !task.relationships?.habitId || !task.relationships?.date) return;
      
      // Remove from tracking map
      const taskKey = `${task.relationships.habitId}-${task.relationships.date}`;
      if (scheduledTasksRef.current.has(taskKey)) {
        console.log(`Removing tracked task key ${taskKey} for task ${taskId}`);
        scheduledTasksRef.current.delete(taskKey);
      }
    };

    // Clean up tracking map daily
    const setupDailyCleanup = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeUntilMidnight = tomorrow.getTime() - now.getTime();
      
      setTimeout(() => {
        console.log('Clearing scheduled tasks tracking map');
        scheduledTasksRef.current.clear();
        setupDailyCleanup(); // Set up next day's cleanup
      }, timeUntilMidnight);
    };
    
    setupDailyCleanup();

    // Listen for habit scheduling
    const unsubscribeSchedule = eventBus.on('habit:schedule', handleHabitSchedule);
    
    // Listen for template deletions
    const unsubscribeTemplateDelete = eventBus.on('habit:template-delete', handleTemplateDelete);
    
    // Listen for task deletions
    const unsubscribeTaskDelete = eventBus.on('task:delete', handleTaskDelete);
    
    return () => {
      unsubscribeSchedule();
      unsubscribeTemplateDelete();
      unsubscribeTaskDelete();
    };
  }, [tasks, addTagToEntity, forceUpdate, location]);

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
