import React, { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Star, Timer, BookOpen } from 'lucide-react';
import { HabitDetail, MetricType } from '@/types/habits';
import { toast } from 'sonner';
import { eventManager } from '@/lib/events/EventManager';
import { useNoteActions, useNoteState } from '@/contexts/notes/NoteContext';
import JournalModal from './journal/JournalModal';
import { relationshipManager } from '@/lib/relationshipManager';
import { EntityType } from '@/types/core';

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
  const [hasExistingEntry, setHasExistingEntry] = useState(false);
  const noteState = useNoteState();

  useEffect(() => {
    const checkForExistingEntry = () => {
      const relatedEntities = relationshipManager.getRelatedEntities(habit.id, EntityType.Habit, EntityType.Note);
      
      if (relatedEntities.length > 0) {
        const noteId = relatedEntities[0].id;
        const foundNote = noteState.notes.find(note => note.id === noteId);
        
        setHasExistingEntry(!!foundNote);
        console.log(`Habit ${habit.id} journal entry exists: ${!!foundNote}`);
        
        if (!foundNote && progress.value) {
          setTimeout(() => {
            console.log("No journal found but habit marked complete - updating state");
            onUpdate(false);
          }, 0);
        }
      } else {
        setHasExistingEntry(false);
      }
    };
    
    checkForExistingEntry();
  }, [habit.id, noteState.notes, progress.value, onUpdate]);

  const handleOpenJournal = () => {
    setJournalModalOpen(true);
  };

  const handleJournalComplete = () => {
    onUpdate(true);
    setJournalModalOpen(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  const renderMetric = () => {
    const metricType = habit.metrics?.type as MetricType;
    
    switch (metricType) {
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
        const timerTarget = habit.metrics.goal || habit.metrics.target || 600;
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
        const countTarget = habit.metrics.goal || habit.metrics.target || 1;
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
          <>
            <Button 
              variant="outline" 
              size="sm"
              className="h-6 px-2 text-xs flex items-center gap-1"
              onClick={handleOpenJournal}
              title={hasExistingEntry ? "View journal entry" : "Create journal entry"}
            >
              <BookOpen className="h-3 w-3" />
              {hasExistingEntry ? "View" : "Write"}
            </Button>
            <JournalModal
              open={journalModalOpen}
              onOpenChange={setJournalModalOpen}
              habitId={habit.id}
              habitName={habit.name}
              description={habit.description}
              onComplete={handleJournalComplete}
              templateId={templateId}
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
