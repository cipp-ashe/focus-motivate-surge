
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, Edit, X } from 'lucide-react';
import { toast } from 'sonner';
import { eventManager } from '@/lib/events/EventManager';

interface JournalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentTask: {
    taskId: string;
    taskName: string;
    entry: string;
  } | null;
}

export const JournalDialog: React.FC<JournalDialogProps> = ({
  isOpen,
  onOpenChange,
  currentTask
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');

  // Initialize content when dialog opens or task changes
  useEffect(() => {
    if (currentTask) {
      setContent(currentTask.entry || '');
    }
    // Not starting in edit mode if there's already content
    setIsEditing(!currentTask?.entry);
  }, [currentTask, isOpen]);

  const handleSave = () => {
    if (!currentTask) return;

    // Save the journal entry
    eventManager.emit('task:update', {
      taskId: currentTask.taskId,
      updates: {
        journalEntry: content
      }
    });

    setIsEditing(false);
    toast.success('Journal entry saved');
  };

  const handleCancelEdit = () => {
    if (currentTask) {
      setContent(currentTask.entry || '');
    }
    setIsEditing(false);
  };

  if (!currentTask) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader className="flex flex-col space-y-1.5 pb-2">
          <DialogTitle className="text-xl">
            {currentTask.taskName}
          </DialogTitle>
          
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
                  onClick={handleSave}
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
        
        <div className="mt-4">
          {isEditing ? (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your journal entry here..."
              className="min-h-[400px] text-sm"
              autoFocus
            />
          ) : (
            <div className="whitespace-pre-wrap bg-muted/30 p-4 rounded-md min-h-[400px] text-sm">
              {content || 'No journal entry yet.'}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
