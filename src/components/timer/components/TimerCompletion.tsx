
import { TimerCompletionDialog, TimerCompletionDialogContent } from "../TimerCompletionDialog";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Check, Plus, Timer } from "lucide-react";

interface TimerCompletionProps {
  showConfirmation: boolean;
  setShowConfirmation: (show: boolean) => void;
  handleAddTimeAndContinue: () => void;
  handleComplete: () => Promise<void>;
}

export const TimerCompletion = ({
  showConfirmation,
  setShowConfirmation,
  handleAddTimeAndContinue,
  handleComplete,
}: TimerCompletionProps) => {
  // Handle the button click while properly managing the Promise
  const onCompleteClick = async () => {
    try {
      await handleComplete();
    } catch (error) {
      console.error("Error completing timer:", error);
    }
  };

  return (
    <TimerCompletionDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
      <TimerCompletionDialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-primary">
            <Timer className="h-5 w-5 text-primary" />
            Timer Complete
          </DialogTitle>
          <DialogDescription className="text-foreground/70 pt-2">
            Are you finished with this task, or would you like to add more time?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleAddTimeAndContinue}
            className="w-full sm:w-auto flex items-center gap-2 border-primary/20 bg-background/80"
          >
            <Plus className="h-4 w-4" />
            Add 5 Minutes
          </Button>
          <Button
            onClick={onCompleteClick}
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary text-white flex items-center gap-2 shadow-md"
          >
            <Check className="h-4 w-4" />
            Complete Task
          </Button>
        </DialogFooter>
      </TimerCompletionDialogContent>
    </TimerCompletionDialog>
  );
};
