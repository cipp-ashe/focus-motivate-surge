
import { memo } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Loader2, Volume2 } from "lucide-react";
import { SoundSelectorProps, SOUND_OPTIONS } from "../types/timer";
import { cn } from "@/lib/utils";

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
        {Object.keys(SOUND_OPTIONS).map((sound) => (
          <div key={sound} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={sound} 
              id={sound}
              disabled={isLoadingAudio}
              aria-label={`Select ${sound} sound`}
              className="border-primary/30 focus:ring-primary/40"
            />
            <Label 
              htmlFor={sound} 
              className="capitalize text-foreground/80 cursor-pointer"
            >
              {sound}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
    <Button
      variant="secondary"
      size="sm"
      onClick={onTestSound}
      className={cn(
        "mt-3 mx-auto block",
        "transition-all duration-200",
        "text-foreground/80 hover:text-foreground",
        "w-32 h-9",
        isLoadingAudio && "opacity-70"
      )}
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
