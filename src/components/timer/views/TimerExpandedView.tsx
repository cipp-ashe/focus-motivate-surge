
import React, { forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { TimerCircle } from "../TimerCircle";
import { TimerControls } from "../controls/TimerControls";
import { MinutesInput } from "@/components/minutes/MinutesInput";
import { TimerHeader } from "../TimerHeader";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteDisplay } from "@/components/quotes/QuoteDisplay";
import { TimerMetrics } from "../TimerMetrics";
import { TimerStateMetrics } from "@/types/metrics";
import { Quote, SoundOption } from "@/types/timer";

export interface TimerExpandedViewProps {
  taskName: string;
  timerCircleProps: any;
  timerControlsProps: any;
  metrics: TimerStateMetrics;
  internalMinutes: number;
  handleMinutesChange: (minutes: number) => void;
  selectedSound: SoundOption;
  onSoundChange: (sound: SoundOption) => void;
  onTestSound: () => void;
  isLoadingAudio: boolean;
  onCollapse: () => void;
  onLike: () => void;
  handleCloseTimer: () => void;
  favorites?: Quote[];
  setFavorites?: React.Dispatch<React.SetStateAction<Quote[]>>;
}

export interface TimerExpandedViewRef {
  expand: () => void;
  collapse: () => void;
  toggleExpansion: () => void;
  isExpanded: boolean;
}

export const TimerExpandedView = forwardRef<TimerExpandedViewRef, TimerExpandedViewProps>(({
  taskName,
  timerCircleProps,
  timerControlsProps,
  metrics,
  internalMinutes,
  handleMinutesChange,
  selectedSound,
  onSoundChange,
  onTestSound,
  isLoadingAudio,
  onCollapse,
  onLike,
  handleCloseTimer,
  favorites,
  setFavorites
}, ref) => {
  // Set up refs and state for expansion handling
  const [isExpanded, setIsExpanded] = React.useState(true);
  
  useImperativeHandle(ref, () => ({
    expand: () => setIsExpanded(true),
    collapse: () => setIsExpanded(false),
    toggleExpansion: () => setIsExpanded(!isExpanded),
    isExpanded
  }));

  return (
    <CardContent className="p-4">
      <div className="flex flex-col items-center gap-4">
        <TimerHeader 
          taskName={taskName} 
          onCloseTimer={handleCloseTimer}
        />
        
        <div className="flex flex-col md:flex-row gap-6 w-full">
          <div className="flex flex-col items-center gap-4 w-full md:w-1/2">
            <TimerCircle {...timerCircleProps} size="large" />
            <TimerControls {...timerControlsProps} size="large" />
          </div>
          
          <div className="flex flex-col gap-4 w-full md:w-1/2">
            <div className="flex items-center gap-2">
              <MinutesInput 
                minutes={Math.floor(internalMinutes)} 
                onMinutesChange={handleMinutesChange}
                minMinutes={1}
                maxMinutes={180}
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={onCollapse}
              >
                Collapse
              </Button>
            </div>
            
            <TimerMetrics 
              metrics={metrics}
              taskName={taskName}
            />
            
            <div className="space-y-2">
              <QuoteDisplay 
                onLike={onLike}
                showRandomQuotes={true}
              />
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  );
});

TimerExpandedView.displayName = "TimerExpandedView";
