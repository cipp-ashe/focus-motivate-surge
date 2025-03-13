
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { eventBus } from '@/lib/eventBus';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { toast } from 'sonner';

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
  const [journalContent, setJournalContent] = useState('');

  // Set content when the current task changes
  useEffect(() => {
    if (currentTask) {
      setJournalContent(currentTask.entry || '');
    }
  }, [currentTask]);

  const saveJournal = () => {
    if (currentTask) {
      console.log('Saving journal entry for task:', {
        taskId: currentTask.taskId,
        entry: journalContent
      });
      
      eventBus.emit('task:update', {
        taskId: currentTask.taskId,
        updates: { 
          journalEntry: journalContent,
          taskType: 'journal' 
        }
      });
      
      toast.success(`Saved journal entry for: ${currentTask.taskName}`);
      onOpenChange(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    console.log('Journal dialog open state changed:', open, 'current:', isOpen);
    if (!open && isOpen) {
      saveJournal();
    }
    onOpenChange(open);
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={handleDialogOpenChange}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{currentTask?.taskName || 'Journal Entry'}</DialogTitle>
        </DialogHeader>
        
        <div className="h-[60vh]">
          <MarkdownEditor
            value={journalContent}
            onChange={(value) => setJournalContent(value || '')}
            placeholder="Write your thoughts here..."
            height="100%"
          />
        </div>
        
        <div className="pt-4">
          <Button onClick={saveJournal} className="w-full" type="button">
            <Save className="h-4 w-4 mr-2" /> Save Journal Entry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
