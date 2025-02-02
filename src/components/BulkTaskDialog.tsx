import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface BulkTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bulkTasks: string;
  onBulkTasksChange: (value: string) => void;
  onAdd: () => void;
}

export const BulkTaskDialog = ({
  open,
  onOpenChange,
  bulkTasks,
  onBulkTasksChange,
  onAdd,
}: BulkTaskDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="bg-card border-primary/20">
      <DialogHeader>
        <DialogTitle>Bulk Add Tasks</DialogTitle>
      </DialogHeader>
      <Textarea
        placeholder="Enter tasks (one per line)...&#10;Task name, duration (optional)&#10;Example:&#10;Read book, 30&#10;Write code"
        value={bulkTasks}
        onChange={(e) => onBulkTasksChange(e.target.value)}
        className="min-h-[200px] bg-background/50 border-primary/20"
      />
      <Button 
        onClick={onAdd}
        className="bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary"
      >
        Add Tasks
      </Button>
    </DialogContent>
  </Dialog>
);