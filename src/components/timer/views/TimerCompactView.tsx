
import React from "react";
import { Button } from "@/components/ui/button";
import { TimerCircle } from "../TimerCircle";
import { TimerControls } from "../controls/TimerControls";
import { MinutesInput } from "@/components/minutes/MinutesInput";
import { TimerHeader } from "../TimerHeader";
import { SoundSelector } from "@/components/SoundSelector";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteDisplay } from "@/components/quotes/QuoteDisplay";
import { TimerStateMetrics } from "@/types/metrics";
import { Quote, SoundOption } from "@/types/timer";

export interface TimerCompactViewProps {
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
  onExpand: () => void;
  onLike: () => void;
  favorites?: Quote[];
  setFavorites?: React.Dispatch<React.SetStateAction<Quote[]>>;
}

export const TimerCompactView: React.FC<TimerCompactViewProps> = ({
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
  onExpand,
  onLike,
  favorites,
  setFavorites
}) => {
  return (
    <CardContent className="p-4">
      <div className="flex flex-col items-center gap-4">
        <TimerHeader taskName={taskName} onCloseTimer={() => {}} />
        
        <div className="flex flex-col items-center w-full gap-4">
          <TimerCircle {...timerCircleProps} />
          
          <div className="flex flex-col items-center gap-3 w-full">
            <TimerControls {...timerControlsProps} />
            
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex items-center justify-center w-full gap-2">
                <MinutesInput 
                  minutes={Math.floor(internalMinutes)} 
                  onMinutesChange={handleMinutesChange}
                  minMinutes={1}
                  maxMinutes={120}
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExpand}
                  className="h-8"
                >
                  Expand
                </Button>
              </div>
              
              <SoundSelector
                selectedSound={selectedSound}
                onSoundChange={onSoundChange}
                onTestSound={onTestSound}
                isLoadingAudio={isLoadingAudio}
              />
            </div>
          </div>

          <QuoteDisplay onLike={onLike} />
        </div>
      </div>
    </CardContent>
  );
};
