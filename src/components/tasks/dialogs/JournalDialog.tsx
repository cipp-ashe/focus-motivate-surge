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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { marked } from 'marked';

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
  const [activeTab, setActiveTab] = useState<string>("write");

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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="write" className="h-[60vh]">
            <MarkdownEditor
              value={journalContent}
              onChange={(value) => setJournalContent(value || '')}
              placeholder="Write your thoughts here..."
              height="100%"
              preview="edit"
            />
          </TabsContent>
          
          <TabsContent value="preview" className="h-[60vh] overflow-y-auto p-4 border rounded-md">
            {journalContent ? (
              <div 
                className="prose prose-sm dark:prose-invert max-w-none" 
                dangerouslySetInnerHTML={{ __html: marked.parse(journalContent) }} 
              />
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nothing to preview yet. Start writing in the editor!
              </p>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="pt-4">
          <Button onClick={saveJournal} className="w-full" type="button">
            <Save className="h-4 w-4 mr-2" /> Save Journal Entry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
