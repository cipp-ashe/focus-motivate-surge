import { memo } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { SoundSelectorProps, SOUND_OPTIONS } from "../types/timer";

export const SoundSelector = memo(({
  selectedSound,
  onSoundChange,
  onTestSound
}: SoundSelectorProps) => (
  <div className="space-y-2">
    <Label className="text-sm text-muted-foreground">Completion Sound</Label>
    <RadioGroup
      value={selectedSound}
      onValueChange={onSoundChange}
      className="flex flex-wrap justify-center gap-4"
    >
      {Object.keys(SOUND_OPTIONS).map((sound) => (
        <div key={sound} className="flex items-center space-x-2">
          <RadioGroupItem value={sound} id={sound} />
          <Label htmlFor={sound} className="capitalize">{sound}</Label>
        </div>
      ))}
    </RadioGroup>
    <Button
      variant="outline"
      size="sm"
      onClick={onTestSound}
      className="mt-2"
    >
      Test Sound
    </Button>
  </div>
));

SoundSelector.displayName = 'SoundSelector';