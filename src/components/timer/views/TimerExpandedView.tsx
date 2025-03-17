
import React, { forwardRef, useImperativeHandle, useState, useRef } from "react";
import { TimerCircle } from "../components/TimerCircle";
import { TimerControls } from "../components/TimerControls";
import { TimerMinutesInput } from "../components/TimerMinutesInput";
import { TimerTaskDisplay } from "../components/TimerTaskDisplay";
import { TimerMetrics } from "../TimerMetrics";
import { TimerQuote } from "../components/TimerQuote";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TimerStateMetrics } from "@/types/metrics";
import { TimerExpandedViewRef } from "@/types/timer";
import { Quote } from "@/types/timer";
import { Textarea } from "@/components/ui/textarea";

interface TimerExpandedViewProps {
  taskName: string;
  timerCircleProps: any;
  timerControlsProps: any;
  metrics: TimerStateMetrics;
  onClose: () => void;
  onLike?: () => void;
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
}

export const TimerExpandedView = forwardRef<
  TimerExpandedViewRef,
  TimerExpandedViewProps
>(
  (
    {
      taskName,
      timerCircleProps,
      timerControlsProps,
      metrics,
      onClose,
      onLike,
      favorites,
      setFavorites,
    },
    ref
  ) => {
    const [notes, setNotes] = useState<string>("");
    const notesRef = useRef<HTMLTextAreaElement>(null);
    const isRunning = timerControlsProps.isRunning;

    useImperativeHandle(ref, () => ({
      saveNotes: () => {
        const notesValue = notesRef.current?.value || "";
        console.log("Saving notes:", notesValue);
        // Here you could save notes to a database or local storage
        localStorage.setItem(`timer-notes-${taskName}`, notesValue);
        return notesValue;
      },
    }));

    // Load existing notes on mount
    React.useEffect(() => {
      const savedNotes = localStorage.getItem(`timer-notes-${taskName}`);
      if (savedNotes) {
        setNotes(savedNotes);
      }
    }, [taskName]);

    return (
      <div className="container mx-auto px-4 h-full py-4 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <TimerTaskDisplay
            taskName={taskName}
            className="text-2xl font-bold"
          />

          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          <div className="flex flex-col gap-6">
            <div className="flex justify-center">
              <TimerCircle
                size={300}
                strokeWidth={16}
                className="mx-auto"
                {...timerCircleProps}
              />
            </div>

            <TimerControls size="large" {...timerControlsProps} />

            <Card className="p-4 bg-muted/40">
              <TimerQuote
                favorites={favorites}
                setFavorites={setFavorites}
                expanded
                onLike={onLike}
              />
            </Card>

            <TimerMetrics metrics={metrics} taskName={taskName} />
          </div>

          <div className="flex flex-col gap-6">
            <Card className="p-4 flex-grow">
              <h3 className="text-lg font-semibold mb-3">Session Notes</h3>
              <Textarea
                ref={notesRef}
                placeholder="Write your thoughts, insights or session notes here..."
                className="min-h-[300px] flex-grow"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Focus Tips</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Break your work into smaller, manageable tasks</li>
                <li>Eliminate distractions during your timer session</li>
                <li>Use the Pomodoro technique: 25 minutes of focus followed by a 5-minute break</li>
                <li>Stay hydrated and take deep breaths if you feel distracted</li>
                <li>Reflect on your progress in the notes section</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    );
  }
);

TimerExpandedView.displayName = "TimerExpandedView";
