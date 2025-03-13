import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';
import { eventBus } from '@/lib/eventBus';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { toast } from 'sonner';

interface JournalSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentTask: {
    taskId: string;
    taskName: string;
    entry: string;
  } | null;
}

export const JournalSheet: React.FC<JournalSheetProps> = ({
  isOpen,
  onOpenChange,
  currentTask
}) => {
  const [journalContent, setJournalContent] = useState('');
  const isNewEntry = currentTask?.entry === '';

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
      onOpenChange(false);  // Close sheet after saving
    }
  };

  const handleSheetOpenChange = (open: boolean) => {
    console.log('Journal sheet open state changed:', open, 'current:', isOpen);
    if (!open && isOpen) {
      saveJournal();
    }
    onOpenChange(open);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  // Title text based on whether it's a new or existing entry
  const sheetTitle = isNewEntry 
    ? `New Journal Entry: ${currentTask?.taskName}` 
    : `${currentTask?.taskName} - Journal Entry`;

  return (
    <Sheet 
      open={isOpen} 
      onOpenChange={handleSheetOpenChange}
    >
      <SheetContent className="w-full md:max-w-xl overflow-y-auto p-0" side="right">
        <SheetHeader className="p-4 pb-2 border-b flex justify-between items-center relative">
          <SheetTitle>{sheetTitle}</SheetTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </SheetHeader>
        
        <div className="h-[calc(100vh-10rem)]">
          <MarkdownEditor
            value={journalContent}
            onChange={(value) => setJournalContent(value || '')}
            placeholder={isNewEntry ? "What are your thoughts about this task?" : "Write your thoughts here..."}
            height="100%"
          />
        </div>
        
        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={saveJournal} type="button">
            <Save className="h-4 w-4 mr-2" /> Save Journal Entry
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
