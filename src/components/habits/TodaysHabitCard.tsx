import { Timer, Plus, BookOpen, CheckCircle, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import type { HabitDetail } from "@/components/habits/types";
import { eventBus } from "@/lib/eventBus";
import { useNoteActions } from "@/contexts/notes/NoteContext";

interface HabitRowProps {
  habit: HabitDetail;
  isCompleted: boolean;
  onComplete: () => void;
  onStart?: () => void;
}

const HabitRow = ({ habit, isCompleted, onComplete, onStart }: HabitRowProps) => {
  const noteActions = useNoteActions();
  const isTimerHabit = habit.metrics.type === 'timer';
  const isJournalHabit = habit.metrics.type === 'journal';
  
  const formatMinutes = (seconds?: number) => {
    if (!seconds) return '0m';
    return `${Math.floor(seconds / 60)}m`;
  };
  
  const handleTimerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStart) {
      onStart();
    }
  };

  const handleJournalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create a new note with data from the habit
    const newNote = {
      title: `${habit.name} - ${new Date().toLocaleDateString()}`,
      content: `## ${habit.name}\n\n${habit.description || ''}\n\n`,
      tags: [{ name: 'journal', color: 'default' }, { name: habit.name.toLowerCase(), color: 'default' }]
    };
    
    // Add the note using the context
    noteActions.addNote(newNote);
    
    // Mark as completed
    onComplete();
    
    // Use event bus for any other components that might be listening
    eventBus.emit('note:create-from-habit', {
      habitId: habit.id,
      habitName: habit.name,
      description: habit.description || ''
    });
    
    toast.success(`Created new journal entry for: ${habit.name}`, {
      description: "Your journal entry has been created"
    });
  };
  
  return (
    <div className="flex items-center justify-between p-3 bg-card hover:bg-accent/50 rounded-md transition-colors">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={onComplete}
          className="h-5 w-5 rounded border-primary"
        />
        <div className="flex flex-col">
          <span className={`${isCompleted ? 'line-through text-muted-foreground' : 'font-medium'}`}>
            {habit.name}
          </span>
          {habit.description && (
            <span className="text-xs text-muted-foreground">
              {habit.description}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {habit.tips && habit.tips.length > 0 && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent 
                side="left" 
                className="max-w-[300px] bg-popover border-border shadow-md z-50"
                sideOffset={5}
                align="center"
              >
                <div className="space-y-2 p-1">
                  <p className="font-medium text-sm">Tips:</p>
                  <ul className="list-disc pl-5 text-xs space-y-1">
                    {habit.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {isTimerHabit && habit.metrics.target && (
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">
              {formatMinutes(habit.metrics.target)}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleTimerClick}
              className="h-8 w-8"
            >
              <Timer className="h-4 w-4" />
            </Button>
          </div>
        )}

        {isJournalHabit && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleJournalClick}
            className="h-8 w-8"
          >
            <BookOpen className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

interface HabitSectionProps {
  title: string;
  habits: HabitDetail[];
  completedHabits: string[];
  onHabitComplete: (habit: HabitDetail) => void;
  onAddHabitToTasks?: (habit: HabitDetail) => void;
}

const HabitSection = ({
  title,
  habits,
  completedHabits,
  onHabitComplete,
  onAddHabitToTasks,
}: HabitSectionProps) => {
  if (habits.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {habits.map((habit) => (
        <HabitRow
          key={habit.id}
          habit={habit}
          isCompleted={completedHabits.includes(habit.id)}
          onComplete={() => onHabitComplete(habit)}
          onStart={onAddHabitToTasks ? () => onAddHabitToTasks(habit) : undefined}
        />
      ))}
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

  const durationHabits = habits.filter(habit => 
    habit.metrics.type === 'timer' && habit.metrics.target
  );
  
  const journalHabits = habits.filter(habit => 
    (habit.name.toLowerCase().includes('journal') || 
     habit.description.toLowerCase().includes('journal')) &&
    habit.metrics.type !== 'timer'
  );
  
  const otherHabits = habits.filter(habit => 
    habit.metrics.type !== 'timer' && 
    !habit.name.toLowerCase().includes('journal') &&
    !habit.description.toLowerCase().includes('journal')
  );

  const handleStartHabit = (habit: HabitDetail) => {
    if (!habit.metrics.target) {
      console.warn('Habit has no target duration:', habit);
      toast.error("This habit doesn't have a duration set");
      return;
    }
    onAddHabitToTasks(habit);
    toast.success(`Started "${habit.name}"`);
  };

  return (
    <Card className="mt-6">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Today's Habits
          </h2>
          <span className="text-sm text-muted-foreground">
            {habits.length} habit{habits.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="p-4 space-y-4">
          {durationHabits.length > 0 && (
            <HabitSection
              title="Timed Habits"
              habits={durationHabits}
              completedHabits={completedHabits}
              onHabitComplete={onHabitComplete}
              onAddHabitToTasks={handleStartHabit}
            />
          )}
          
          {durationHabits.length > 0 && (journalHabits.length > 0 || otherHabits.length > 0) && (
            <Separator className="my-4" />
          )}
          
          {journalHabits.length > 0 && (
            <HabitSection
              title="Journal Habits"
              habits={journalHabits}
              completedHabits={completedHabits}
              onHabitComplete={onHabitComplete}
            />
          )}
          
          {journalHabits.length > 0 && otherHabits.length > 0 && (
            <Separator className="my-4" />
          )}
          
          {otherHabits.length > 0 && (
            <HabitSection
              title="Daily Habits"
              habits={otherHabits}
              completedHabits={completedHabits}
              onHabitComplete={onHabitComplete}
            />
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
