
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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Edit, Save, X } from 'lucide-react';

interface JournalDialogProps {
  task: Task;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const JournalDialog: React.FC<JournalDialogProps> = ({
  task,
  isOpen,
  setIsOpen,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [editedJournalEntry, setEditedJournalEntry] = useState(task.journalEntry || '');

  useEffect(() => {
    if (isOpen) {
      setEditedName(task.name);
      setEditedJournalEntry(task.journalEntry || '');
      setIsEditing(false);
    }
  }, [isOpen, task.name, task.journalEntry]);

  const handleSaveEdit = () => {
    if (!editedName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    const updates = {
      name: editedName.trim(),
      journalEntry: editedJournalEntry.trim() || undefined
    };

    eventBus.emit('task:update', { 
      taskId: task.id, 
      updates 
    });

    setIsEditing(false);
    toast.success('Journal entry updated');
  };

  const handleCancelEdit = () => {
    setEditedName(task.name);
    setEditedJournalEntry(task.journalEntry || '');
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
                placeholder="Journal entry name"
                className="font-medium"
                autoFocus
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
        
        <div className="mt-2">
          {isEditing ? (
            <Textarea
              value={editedJournalEntry}
              onChange={(e) => setEditedJournalEntry(e.target.value)}
              placeholder="Write your journal entry here..."
              className="min-h-[400px] text-sm"
            />
          ) : (
            <div className="whitespace-pre-wrap bg-muted/30 p-4 rounded-md min-h-[400px] text-sm">
              {task.journalEntry || 'No journal entry yet.'}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
