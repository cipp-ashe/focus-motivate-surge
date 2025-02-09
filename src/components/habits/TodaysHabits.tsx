
import { Timer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import TaskRow from "@/components/tasks/TaskRow";
import type { Task } from "@/components/tasks/TaskList";
import type { HabitDetail } from "@/components/habits/types";
import { toast } from "sonner";

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
  const getHabitAsTask = (habit: HabitDetail): Task => ({
    id: habit.id,
    name: habit.name,
    completed: completedHabits.includes(habit.id),
    duration: habit.duration || 0,
    metrics: undefined
  });

  if (habits.length === 0) return null;

  return (
    <Card className="mt-6 p-4 border-primary/20 bg-gradient-to-br from-card to-card/50">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
          <Timer className="h-5 w-5 text-primary animate-pulse-slow" />
          Today's Habits
        </h2>
        <span className="text-sm text-muted-foreground">
          {habits.length} habit{habits.length !== 1 ? 's' : ''}
        </span>
      </div>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
          {habits.map((habit) => (
            <div key={habit.id} className="relative">
              <TaskRow
                task={getHabitAsTask(habit)}
                isSelected={false}
                editingTaskId={null}
                onTaskClick={() => onHabitClick(habit)}
                onTaskDelete={() => {}}
                onDurationChange={() => {}}
                onDurationClick={() => {}}
                onInputBlur={() => {}}
              />
              {habit.duration && habit.duration > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddHabitToTasks(habit)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background hover:bg-primary hover:text-primary-foreground flex items-center gap-1"
                >
                  Add as Task
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

