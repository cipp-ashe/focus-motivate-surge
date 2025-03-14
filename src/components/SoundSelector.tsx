
import { memo } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Loader2, Volume2 } from "lucide-react";
import { SoundSelectorProps, SOUND_OPTIONS } from "../types/timer";

export const SoundSelector = memo(({
  selectedSound,
  onSoundChange,
  onTestSound,
  isLoadingAudio = false
}: SoundSelectorProps) => (
  <div className="space-y-3">
    <div className="flex flex-wrap justify-center gap-4">
      <RadioGroup
        value={selectedSound}
        onValueChange={onSoundChange}
        className="flex flex-wrap justify-center gap-4"
      >
        {Object.keys(SOUND_OPTIONS).map((sound) => (
          <div key={sound} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={sound} 
              id={sound}
              disabled={isLoadingAudio}
              aria-label={`Select ${sound} sound`}
              className="border-primary/30"
            />
            <Label 
              htmlFor={sound} 
              className="capitalize text-foreground/80"
            >
              {sound}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
    <Button
      variant="outline"
      size="sm"
      onClick={onTestSound}
      className="mt-3 mx-auto block border-primary/30 bg-card hover:bg-primary/10"
      disabled={isLoadingAudio || selectedSound === "none"}
      aria-label={`Test ${selectedSound} sound`}
    >
      {isLoadingAudio ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Playing...
        </>
      ) : (
        <>
          <Volume2 className="mr-2 h-4 w-4" />
          Test Sound
        </>
      )}
    </Button>
  </div>
));

SoundSelector.displayName = 'SoundSelector';
