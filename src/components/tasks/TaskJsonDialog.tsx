
import { Task } from "./TaskList";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useIsMobile } from "@/hooks/use-mobile";

interface TaskJsonDialogProps {
  tasks: Task[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TaskJsonDialog = ({ tasks, open, onOpenChange }: TaskJsonDialogProps) => {
  const { width } = useWindowSize();
  const isMobile = useIsMobile();

  const handleCopyJson = () => {
    const jsonContent = JSON.stringify(tasks, null, 2);
    navigator.clipboard.writeText(jsonContent);
    toast.success('JSON copied to clipboard');
  };

  // Calculate max width based on screen size
  const getMaxWidth = () => {
    if (width <= 640) return 'calc(100vw - 32px)'; // For mobile
    if (width <= 1024) return '600px'; // For tablets
    return '800px'; // For desktop
  };

  // Calculate max height based on screen size
  const getMaxHeight = () => {
    if (isMobile) return 'calc(100vh - 100px)';
    return '80vh';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-full overflow-hidden"
        style={{ 
          maxWidth: getMaxWidth(),
          maxHeight: getMaxHeight(),
          margin: isMobile ? '16px' : undefined
        }}
      >
        <DialogHeader>
          <DialogTitle>Task Metrics JSON Data</DialogTitle>
        </DialogHeader>
        <div className="relative flex-1 min-h-0">
          <pre className="bg-muted p-4 rounded-lg overflow-auto" style={{ maxHeight: isMobile ? 'calc(100vh - 200px)' : '60vh' }}>
            <code className="text-xs sm:text-sm whitespace-pre-wrap break-words">
              {JSON.stringify(tasks, null, 2)}
            </code>
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
