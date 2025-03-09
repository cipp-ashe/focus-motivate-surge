
import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Star, Timer, BookOpen } from 'lucide-react';
import { HabitDetail } from './types';
import { toast } from 'sonner';
import { eventBus } from '@/lib/eventBus';
import { useNoteActions, useNoteState } from '@/contexts/notes/NoteContext';
import JournalModal from './journal/JournalModal';
import { relationshipManager } from '@/lib/relationshipManager';

interface ProgressResult {
  value: boolean | number;
  streak: number;
}

interface HabitMetricProps {
  habit: HabitDetail;
  progress: ProgressResult;
  onUpdate: (value: boolean | number) => void;
  templateId?: string; // Add templateId prop
}

const HabitMetric: React.FC<HabitMetricProps> = ({
  habit,
  progress,
  onUpdate,
  templateId,
}) => {
  const [journalModalOpen, setJournalModalOpen] = useState(false);
  const noteState = useNoteState();

  const handleOpenJournal = () => {
    setJournalModalOpen(true);
  };

  const handleJournalComplete = () => {
    // Mark the journal habit as completed
    onUpdate(true);
    setJournalModalOpen(false);
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
        const isCompleted = !!progress.value;
        return (
          <>
            <Button 
              variant="outline" 
              size="sm"
              className="h-6 px-2 text-xs flex items-center gap-1"
              onClick={handleOpenJournal}
              title={isCompleted ? "View journal entry" : "Create journal entry"}
            >
              <BookOpen className="h-3 w-3" />
              {isCompleted ? "View" : "Write"}
            </Button>
            <JournalModal
              open={journalModalOpen}
              onOpenChange={setJournalModalOpen}
              habitId={habit.id}
              habitName={habit.name}
              description={habit.description}
              onComplete={handleJournalComplete}
              templateId={templateId} // Pass the templateId
            />
          </>
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
