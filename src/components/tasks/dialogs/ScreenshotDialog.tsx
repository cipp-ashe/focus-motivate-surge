
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Task } from '@/types/tasks';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScreenshotDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
}

export const ScreenshotDialog: React.FC<ScreenshotDialogProps> = ({
  isOpen,
  onOpenChange,
  task
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl">{task.name}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <Separator className="my-2" />
        
        <div className="mt-4">
          {task.imageUrl ? (
            <AspectRatio ratio={16 / 9} className="bg-card overflow-hidden rounded-md border">
              <img
                src={task.imageUrl}
                alt={`Screenshot for ${task.name}`}
                className="object-contain w-full h-full"
              />
            </AspectRatio>
          ) : (
            <div className="text-center p-8 border rounded-md text-muted-foreground">
              No image available for this task.
            </div>
          )}
        </div>
        
        {task.capturedText && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Captured Text</h3>
            <div className="p-3 rounded-md bg-muted text-sm max-h-40 overflow-y-auto">
              {task.capturedText}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
