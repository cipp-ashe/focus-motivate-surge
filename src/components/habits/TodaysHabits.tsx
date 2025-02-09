
import { Timer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import TaskRow from "@/components/tasks/TaskRow";
import type { Task } from "@/components/tasks/TaskList";
import type { HabitDetail } from "@/components/habits/types";

interface TodaysHabitsProps {
  habits: HabitDetail[];
  completedHabits: string[];
  onHabitClick: (habit: HabitDetail) => void;
  onAddHabitToTasks: (habit: HabitDetail) => void;
}

export const TodaysHabits = ({
  habits,
  completedHabits,
  onHabitClick,
  onAddHabitToTasks,
}: TodaysHabitsProps) => {
  // Filter to only show habits with duration
  const habitsWithDuration = habits.filter(habit => habit.duration && habit.duration > 0);

  if (habitsWithDuration.length === 0) return null;

  const getHabitAsTask = (habit: HabitDetail): Task => {
    return {
      id: habit.id,
      name: habit.name,
      completed: completedHabits.includes(habit.id),
      duration: habit.duration || undefined,
      metrics: undefined
    };
  };

  return (
    <Card className="mt-6 p-4 border-primary/20 bg-gradient-to-br from-card to-card/50">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
          <Timer className="h-5 w-5 text-primary animate-pulse-slow" />
          Today's Timed Habits
        </h2>
        <span className="text-sm text-muted-foreground">
          {habitsWithDuration.length} habit{habitsWithDuration.length !== 1 ? 's' : ''}
        </span>
      </div>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
          {habitsWithDuration.map((habit) => (
            <div key={habit.id} className="relative">
              <TaskRow
                task={getHabitAsTask(habit)}
                isSelected={false}
                editingTaskId={null}
                onTaskClick={() => onAddHabitToTasks(habit)}
                onTaskDelete={() => {}}
                onDurationChange={() => {}}
                onDurationClick={(e) => {
                  e.stopPropagation();
                }}
                onInputBlur={() => {}}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
