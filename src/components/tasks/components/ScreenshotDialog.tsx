
import React, { useState, useEffect } from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScreenshotContent } from '@/components/screenshots/components/ScreenshotContent';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit, Save, X } from 'lucide-react';

interface ScreenshotDialogProps {
  task: Task;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const ScreenshotDialog: React.FC<ScreenshotDialogProps> = ({
  task,
  isOpen,
  setIsOpen,
}) => {
  const [isScreenshotExpanded, setIsScreenshotExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [editedDescription, setEditedDescription] = useState(task.description || '');

  useEffect(() => {
    // Reset editing state and update edited values when dialog opens/closes
    if (isOpen) {
      setEditedName(task.name);
      setEditedDescription(task.description || '');
      setIsEditing(false);
    }
  }, [isOpen, task.name, task.description]);

  const handleSaveEdit = () => {
    if (!editedName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    const updates = {
      name: editedName.trim(),
      description: editedDescription.trim() || undefined
    };

    eventBus.emit('task:update', { 
      taskId: task.id, 
      updates 
    });

    setIsEditing(false);
    toast.success('Screenshot details updated');
  };

  const handleCancelEdit = () => {
    setEditedName(task.name);
    setEditedDescription(task.description || '');
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-col space-y-1.5 pb-2">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Screenshot name"
                className="font-medium"
                autoFocus
              />
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Add a description"
                className="min-h-[60px] text-sm"
              />
            </div>
          ) : (
            <DialogTitle className="text-xl">{task.name}</DialogTitle>
          )}
          
          {/* Edit/Save buttons */}
          <div className="flex justify-end space-x-2 mt-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={handleCancelEdit}
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="text-xs h-8"
                  onClick={handleSaveEdit}
                >
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>
        
        {!isEditing && task.description && (
          <p className="text-sm text-muted-foreground px-1 -mt-1 mb-4">
            {task.description}
          </p>
        )}
        
        <div className="mt-2">
          <ScreenshotContent 
            task={task}
            isExpanded={isScreenshotExpanded}
            setIsExpanded={setIsScreenshotExpanded}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
