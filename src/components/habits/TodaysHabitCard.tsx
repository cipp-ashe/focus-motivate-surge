
import { Timer, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import type { HabitDetail } from "@/components/habits/types";

interface HabitRowProps {
  habit: HabitDetail;
  isCompleted: boolean;
  onComplete: () => void;
  onAddToTasks: () => void;
}

const HabitRow = ({ habit, isCompleted, onComplete, onAddToTasks }: HabitRowProps) => {
  console.log('Rendering habit row:', { habitId: habit.id, habitName: habit.name, duration: habit.duration });
  
  return (
    <div className="flex items-center justify-between p-3 bg-card hover:bg-accent/50 rounded-md transition-colors">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={onComplete}
          className="h-5 w-5 rounded border-primary"
        />
        <span className={`${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
          {habit.name}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {habit.duration && (
          <span className="text-sm text-muted-foreground">
            {habit.duration}m
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onAddToTasks}
          className="h-8 w-8"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

interface TodaysHabitCardProps {
  habits: HabitDetail[];
  completedHabits: string[];
  onHabitComplete: (habit: HabitDetail) => void;
  onAddHabitToTasks: (habit: HabitDetail) => void;
}

export const TodaysHabitCard = ({
  habits,
  completedHabits,
  onHabitComplete,
  onAddHabitToTasks,
}: TodaysHabitCardProps) => {
  if (habits.length === 0) return null;

  const handleAddToTasks = (habit: HabitDetail) => {
    console.log('Attempting to add habit to tasks:', { 
      habitId: habit.id, 
      habitName: habit.name, 
      duration: habit.duration 
    });
    
    if (!habit.duration) {
      console.warn('Habit has no duration:', habit);
      toast.error("This habit doesn't have a duration set");
      return;
    }
    onAddHabitToTasks(habit);
    toast.success(`Added "${habit.name}" to tasks`);
  };

  return (
    <Card className="mt-6">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            Today's Habits
          </h2>
          <span className="text-sm text-muted-foreground">
            {habits.length} habit{habits.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="p-4 space-y-2">
          {habits.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              isCompleted={completedHabits.includes(habit.id)}
              onComplete={() => onHabitComplete(habit)}
              onAddToTasks={() => handleAddToTasks(habit)}
            />
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

