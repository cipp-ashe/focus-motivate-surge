
import { Task } from "./TaskList";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface TaskJsonDialogProps {
  tasks: Task[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TaskJsonDialog = ({ tasks, open, onOpenChange }: TaskJsonDialogProps) => {
  const handleCopyJson = () => {
    const jsonContent = JSON.stringify(tasks, null, 2);
    navigator.clipboard.writeText(jsonContent);
    toast.success('JSON copied to clipboard');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Task Metrics JSON Data</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[60vh]">
            <code>{JSON.stringify(tasks, null, 2)}</code>
          </pre>
          <Button
            onClick={handleCopyJson}
            className="absolute top-2 right-2"
            variant="secondary"
            size="sm"
          >
            Copy JSON
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
