
import { useEffect } from "react";
import { useTodaysHabits } from "@/hooks/useTodaysHabits";
import { useTagSystem } from "@/hooks/useTagSystem";
import { useTaskContext } from "@/contexts/TaskContext";
import { useHabitState } from "@/contexts/habits/HabitContext";
import { eventBus } from "@/lib/eventBus";
import { relationshipManager } from "@/lib/relationshipManager";

export const HabitTaskManager = () => {
  const { templates: activeTemplates } = useHabitState();
  const { todaysHabits } = useTodaysHabits(activeTemplates);
  const { addTagToEntity } = useTagSystem();
  const { items: tasks, completed } = useTaskContext();
  
  useEffect(() => {
    const handleHabitTask = (payload: { habitId: string; templateId: string; duration: number; name: string }) => {
      const taskId = `habit-${payload.habitId}-${new Date().toISOString()}`;
      
      // Create task
      eventBus.emit('task:create', {
        id: taskId,
        name: payload.name,
        completed: false,
        duration: payload.duration,
        createdAt: new Date().toISOString(),
        relationships: { habitId: payload.habitId }
      });

      // Create relationship
      relationshipManager.createRelationship(
        payload.habitId,
        'habit',
        taskId,
        'task',
        'habit-task'
      );

      // Add habit tag
      addTagToEntity('Habit', taskId, 'task');
    };

    const handleHabitComplete = (payload: { habitId: string; taskId: string; templateId: string; metrics?: any }) => {
      // Update relationship with valid properties
      relationshipManager.updateRelationship(
        payload.habitId,
        payload.taskId,
        {
          sourceId: payload.habitId,
          targetId: payload.taskId,
          relationType: 'habit-task',
          sourceType: 'habit',
          targetType: 'task'
        }
      );

      eventBus.emit('task:complete', {
        taskId: payload.taskId,
        metrics: payload.metrics
      });
    };

    // Subscribe to events
    const unsubscribeGenerate = eventBus.on('habit:generate-task', handleHabitTask);
    const unsubscribeComplete = eventBus.on('habit:complete-task', handleHabitComplete);

    return () => {
      unsubscribeGenerate();
      unsubscribeComplete();
    };
  }, [addTagToEntity]);

  // Process timer habits
  useEffect(() => {
    const timerHabits = todaysHabits.filter(habit => habit.metrics?.type === 'timer');
    console.log('Processing timer habits:', timerHabits.length);

    // Get existing task IDs for lookup
    const existingTaskIds = new Set(
      tasks
        .filter(task => task.relationships?.habitId)
        .map(task => task.relationships.habitId)
    );

    // Create tasks for timer habits that don't have one yet
    timerHabits.forEach(habit => {
      if (!existingTaskIds.has(habit.id)) {
        console.log('Generating task for habit:', habit.id);
        
        // Find the template this habit belongs to
        const template = activeTemplates.find(t => 
          t.habits.some(h => h.id === habit.id)
        );
        
        eventBus.emit('habit:generate-task', {
          habitId: habit.id,
          templateId: template?.templateId || '',
          duration: habit.metrics.target || 600,
          name: habit.name
        });
      }
    });
  }, [todaysHabits, tasks, activeTemplates]);

  return null;
};
