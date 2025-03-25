import React from 'react';
import { Button } from '@/components/ui/button';
import { TimerCircle } from '../TimerCircle';
import { TimerControls } from '../controls/TimerControls';
import { MinutesInput } from '@/components/minutes/MinutesInput';
import { TimerHeader } from '../TimerHeader';
import { SoundSelector } from '@/components/SoundSelector';
import { Card, CardContent } from '@/components/ui/card';
import { QuoteDisplay } from '@/components/quotes/QuoteDisplay';
import { TimerStateMetrics } from '@/types/metrics';
import { Quote, SoundOption } from '@/types/timer';

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
  setFavorites,
}) => {
  return (
    <div className="p-4">
      {/* Task name as simple heading */}
      <h3 className="text-lg font-medium text-center mb-4">{taskName}</h3>

      {/* Timer circle - centered and properly sized */}
      <div className="flex justify-center mb-6">
        <TimerCircle {...timerCircleProps} />
      </div>

      {/* Controls in a row with proper spacing */}
      <div className="flex justify-center mb-6">
        <TimerControls {...timerControlsProps} />
      </div>

      {/* Settings in a more compact layout */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
        <MinutesInput
          minutes={Math.floor(internalMinutes)}
          onMinutesChange={handleMinutesChange}
          minMinutes={1}
          maxMinutes={120}
        />

        <SoundSelector
          selectedSound={selectedSound}
          onSoundChange={onSoundChange}
          onTestSound={onTestSound}
          isLoadingAudio={isLoadingAudio}
        />

        <Button variant="outline" size="sm" onClick={onExpand}>
          Expand
        </Button>
      </div>

      {/* Quote at the bottom with proper spacing */}
      <div className="mt-4">
        <QuoteDisplay onLike={onLike} />
      </div>
    </div>
  );
};
