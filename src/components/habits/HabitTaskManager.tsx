
import { useEffect } from "react";
import { useTodaysHabits } from "@/hooks/useTodaysHabits";
import { useTagSystem } from "@/hooks/useTagSystem";
import { useAppState, useAppStateActions } from "@/contexts/AppStateContext";
import { toast } from "sonner";
import type { ActiveTemplate } from "@/components/habits/types";

interface HabitTaskManagerProps {
  activeTemplates: ActiveTemplate[];
}

export const HabitTaskManager = ({ activeTemplates }: HabitTaskManagerProps) => {
  const { todaysHabits } = useTodaysHabits(activeTemplates);
  const { addTagToEntity } = useTagSystem();
  const state = useAppState();
  const actions = useAppStateActions();
  const { tasks: { items: tasks } } = state;

  // Get today's date in YYYY-MM-DD format for dismissed storage
  const today = new Date().toISOString().split('T')[0];
  const DISMISSED_HABITS_KEY = `dismissed-habits-${today}`;

  // Load dismissed habits for today
  const getDismissedHabits = (): string[] => {
    const dismissed = localStorage.getItem(DISMISSED_HABITS_KEY);
    return dismissed ? JSON.parse(dismissed) : [];
  };

  // Save dismissed habit
  const saveDismissedHabit = (habitId: string) => {
    const dismissed = getDismissedHabits();
    localStorage.setItem(DISMISSED_HABITS_KEY, JSON.stringify([...dismissed, habitId]));
  };

  useEffect(() => {
    const dismissedHabits = getDismissedHabits();
    const timerHabits = todaysHabits.filter(habit => 
      habit.metrics?.type === 'timer' && !dismissedHabits.includes(habit.id)
    );
    const activeHabitIds = timerHabits.map(habit => `habit-${habit.id}`);
    
    // Only remove habit-related tasks that are no longer active
    const habitTasks = tasks.filter(task => task.id.startsWith('habit-'));
    habitTasks.forEach(task => {
      if (!activeHabitIds.includes(task.id)) {
        actions.deleteTask(task.id);
        const habitId = task.relationships?.habitId;
        if (habitId) {
          actions.removeRelationship(task.id, habitId);
        }
      }
    });

    // Add new timer habit tasks
    timerHabits.forEach(habit => {
      const taskId = `habit-${habit.id}`;
      if (!tasks.some(t => t.id === taskId)) {
        const target = habit.metrics?.target || 1500;
        
        actions.addTask({
          name: habit.name,
          completed: false,
          duration: target,
          relationships: { habitId: habit.id }
        });

        actions.addRelationship({
          sourceId: taskId,
          sourceType: 'task',
          targetId: habit.id,
          targetType: 'habit',
          relationType: 'habit-task'
        });
        addTagToEntity('Habit', taskId, 'task');
      }
    });
  }, [todaysHabits, tasks]);

  const handleDismiss = (taskId: string, habitId: string) => {
    saveDismissedHabit(habitId);
    actions.deleteTask(taskId);
    actions.removeRelationship(taskId, habitId);
    toast.success("Habit dismissed for today");
  };

  const handleComplete = (taskId: string, duration: number) => {
    actions.completeTask(taskId, {
      expectedTime: duration,
      actualDuration: duration,
      pauseCount: 0,
      favoriteQuotes: 0,
      pausedTime: 0,
      extensionTime: 0,
      netEffectiveTime: duration,
      efficiencyRatio: 100,
      completionStatus: 'Completed On Time',
      endTime: new Date().toISOString(),
    });
    toast.success("Habit marked as completed");
  };

  // Add task action buttons to the UI
  useEffect(() => {
    tasks
      .filter(task => task.relationships?.habitId)
      .forEach(task => {
        const existingElement = document.querySelector(`[data-task-actions="${task.id}"]`);
        if (!existingElement) {
          const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
          if (taskElement) {
            const actionsDiv = document.createElement('div');
            actionsDiv.setAttribute('data-task-actions', task.id);
            actionsDiv.className = 'flex items-center gap-2 ml-auto';
            
            // Complete button
            const completeButton = document.createElement('button');
            completeButton.className = 'inline-flex items-center justify-center h-8 w-8 rounded-md text-green-500 hover:bg-green-100 transition-colors';
            completeButton.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            completeButton.onclick = (e) => {
              e.stopPropagation();
              handleComplete(task.id, task.duration || 1500);
            };
            
            // Dismiss button
            const dismissButton = document.createElement('button');
            dismissButton.className = 'inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:bg-gray-100 transition-colors';
            dismissButton.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
            dismissButton.onclick = (e) => {
              e.stopPropagation();
              handleDismiss(task.id, task.relationships!.habitId!);
            };
            
            actionsDiv.appendChild(completeButton);
            actionsDiv.appendChild(dismissButton);
            taskElement.appendChild(actionsDiv);
          }
        }
      });
  }, [tasks]);

  return null;
};
