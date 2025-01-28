import { memo } from "react";
import { Card } from "./ui/card";
import { TimerCircle } from "./TimerCircle";
import { SoundSelector } from "./SoundSelector";
import { TimerControls } from "./TimerControls";
import { MinutesInput } from "./MinutesInput";
import { CompactTimerProps } from "../types/timer";

export const CompactTimer = memo(({
  taskName,
  isRunning,
  minutes,
  timerCircleProps,
  timerControlsProps,
  selectedSound,
  onSoundChange,
  onTestSound,
  onMinutesChange,
  minMinutes,
  maxMinutes,
  a11yProps,
}: CompactTimerProps) => (
  <Card 
    className="mx-auto bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg p-6"
    {...a11yProps}
  >
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 truncate">
        {taskName}
      </h2>

      <div className={`overflow-hidden transition-all duration-700 ${
        isRunning ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100 mt-6'
      }`}>
        <div className="space-y-6">
          <MinutesInput
            minutes={minutes}
            onMinutesChange={onMinutesChange}
            minMinutes={minMinutes}
            maxMinutes={maxMinutes}
          />

          <SoundSelector
            selectedSound={selectedSound}
            onSoundChange={onSoundChange}
            onTestSound={onTestSound}
          />
        </div>
      </div>

      <TimerCircle size="normal" {...timerCircleProps} />

      <div className="mt-4">
        <TimerControls {...timerControlsProps} />
      </div>
    </div>
  </Card>
));

CompactTimer.displayName = 'CompactTimer';