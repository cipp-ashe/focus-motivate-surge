
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Star, Timer, BookOpen } from 'lucide-react';
import { HabitDetail } from './types';
import { toast } from 'sonner';
import { eventBus } from '@/lib/eventBus';
import { useNoteActions } from '@/contexts/notes/NoteContext';

interface ProgressResult {
  value: boolean | number;
  streak: number;
}

interface HabitMetricProps {
  habit: HabitDetail;
  progress: ProgressResult;
  onUpdate: (value: boolean | number) => void;
}

const HabitMetric: React.FC<HabitMetricProps> = ({
  habit,
  progress,
  onUpdate,
}) => {
  const noteActions = useNoteActions();

  const handleOpenJournal = () => {
    // Create a new note with data from the habit
    const newNote = {
      title: `${habit.name} - ${new Date().toLocaleDateString()}`,
      content: `## ${habit.name}\n\n${habit.description || ''}\n\n`,
      tags: [{ name: 'journal', color: 'default' }, { name: habit.name.toLowerCase(), color: 'default' }]
    };
    
    // Add the note using the context
    noteActions.addNote(newNote);
    
    // Mark as completed when journal is created
    onUpdate(true);
    
    // Also emit the event for other parts of the app that might be listening
    eventBus.emit('note:create-from-habit', { 
      habitId: habit.id, 
      habitName: habit.name,
      description: habit.description || ''
    });
    
    toast.success(`Created new journal entry for: ${habit.name}`, {
      description: "Your journal entry has been created"
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  const renderMetric = () => {
    switch (habit.metrics.type) {
      case 'boolean':
        return (
          <Checkbox
            checked={!!progress.value}
            onCheckedChange={(checked) => onUpdate(!!checked)}
            className="h-5 w-5"
          />
        );
      case 'timer':
        const timerValue = typeof progress.value === 'number' ? progress.value : 0;
        const timerTarget = habit.metrics.target || 600; // Default 10 minutes (in seconds)
        return (
          <div className="flex items-center gap-2">
            <div className="space-y-0.5 w-16">
              <Progress value={(timerValue / timerTarget) * 100} className="h-1" />
              <p className="text-[0.65rem] text-muted-foreground text-right">
                {formatTime(timerValue)}/{formatTime(timerTarget)}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6 rounded-full"
              onClick={() => toast.info(`Starting timer for ${formatTime(timerTarget)}`)}
            >
              <Timer className="h-3 w-3" />
            </Button>
          </div>
        );
      case 'counter':
        const countValue = typeof progress.value === 'number' ? progress.value : 0;
        const countTarget = habit.metrics.target || 1;
        return (
          <div className="flex items-center gap-2">
            <div className="space-y-0.5 w-16">
              <Progress value={(countValue / countTarget) * 100} className="h-1" />
              <p className="text-[0.65rem] text-muted-foreground text-right">
                {countValue}/{countTarget}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6 rounded-full"
              onClick={() => onUpdate(countValue + 1)}
            >
              <span className="text-xs">+1</span>
            </Button>
          </div>
        );
      case 'journal':
        return (
          <Button 
            variant="outline" 
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={handleOpenJournal}
          >
            <BookOpen className="h-3 w-3 mr-1" />
            Write
          </Button>
        );
      case 'rating':
        const ratingValue = typeof progress.value === 'number' ? progress.value : 0;
        return (
          <div className="flex space-x-0.5">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant={rating <= ratingValue ? "default" : "ghost"}
                size="icon"
                onClick={() => onUpdate(rating)}
                className="h-6 w-6 p-0"
              >
                <Star className="h-3 w-3" />
              </Button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return renderMetric();
};

export default HabitMetric;
