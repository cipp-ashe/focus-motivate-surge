
import { TimerCompletionDialog, TimerCompletionDialogContent } from "../TimerCompletionDialog";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Check, Plus, Timer } from "lucide-react";

interface TimerCompletionProps {
  showConfirmation: boolean;
  setShowConfirmation: (show: boolean) => void;
  handleAddTimeAndContinue: () => void;
  handleComplete: () => Promise<void>; // Updated to Promise<void>
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
          <DialogTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            Timer Complete
          </DialogTitle>
          <DialogDescription>
            Are you finished with this task, or would you like to add more time?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleAddTimeAndContinue}
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add 5 Minutes
          </Button>
          <Button
            onClick={onCompleteClick}
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Complete Task
          </Button>
        </DialogFooter>
      </TimerCompletionDialogContent>
    </TimerCompletionDialog>
  );
};
