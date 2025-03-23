
import { memo } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Loader2, Volume2 } from "lucide-react";
import { SoundOption } from "../types/timer";
import { SOUND_OPTIONS } from "../types/timer/constants";
import { cn } from "@/lib/utils";

export interface SoundSelectorProps {
  selectedSound: SoundOption;
  onSoundChange: (sound: SoundOption) => void;
  onTestSound: () => void;
  isLoadingAudio?: boolean;
}

export const SoundSelector = memo(({
  selectedSound,
  onSoundChange,
  onTestSound,
  isLoadingAudio = false
}: SoundSelectorProps) => (
  <div className="space-y-4">
    <div className="flex flex-wrap justify-center gap-4">
      <RadioGroup
        value={selectedSound}
        onValueChange={onSoundChange}
        className="flex flex-wrap justify-center gap-4"
      >
        {SOUND_OPTIONS.map((option) => (
          <div key={option.value} className="sound-option flex items-center space-x-2">
            <RadioGroupItem 
              value={option.value} 
              id={option.value}
              disabled={isLoadingAudio}
              aria-label={`Select ${option.label} sound`}
              className="radio-item"
            />
            <Label 
              htmlFor={option.value} 
              className="capitalize text-foreground/80 cursor-pointer radio-label hover:text-foreground"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
    <Button
      variant="secondary"
      size="sm"
      onClick={onTestSound}
      className="timer-button w-32 h-9 mx-auto"
      disabled={isLoadingAudio || selectedSound === "none"}
      aria-label={`Test ${selectedSound} sound`}
    >
      {isLoadingAudio ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary/70" />
          <span>Playing...</span>
        </>
      ) : (
        <>
          <Volume2 className="mr-2 h-4 w-4 text-primary/70" />
          <span>Test Sound</span>
        </>
      )}
    </Button>
  </div>
));

SoundSelector.displayName = 'SoundSelector';
