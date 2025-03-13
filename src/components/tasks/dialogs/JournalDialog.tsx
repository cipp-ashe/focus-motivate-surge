
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save, X, Pencil } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (currentTask) {
      setJournalContent(currentTask.entry || '');
      // Start in preview mode by default
      setActiveTab("preview");
      setIsEditing(false);
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
      setIsEditing(false);
      setActiveTab("preview");
    }
  };

  const handleCancel = () => {
    console.log('Cancelling journal edit');
    if (isEditing) {
      setIsEditing(false);
      setActiveTab("preview");
      
      // Restore original content if canceling an edit
      if (currentTask) {
        setJournalContent(currentTask.entry || '');
      }
    } else {
      onOpenChange(false);
    }
  };
  
  const handleEdit = () => {
    setIsEditing(true);
    setActiveTab("write");
  };
  
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>{currentTask?.taskName || 'Journal Entry'}</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        
        {isEditing ? (
          <>
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
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={saveJournal} type="button">
                <Save className="h-4 w-4 mr-2" /> Save Journal Entry
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="h-[60vh] overflow-y-auto p-4 border rounded-md">
              {journalContent ? (
                <div 
                  className="prose prose-sm dark:prose-invert max-w-none" 
                  dangerouslySetInnerHTML={{ __html: marked.parse(journalContent) }} 
                />
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No journal entry yet. Click edit to start writing.
                </p>
              )}
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={handleEdit} type="button">
                <Pencil className="h-4 w-4 mr-2" /> Edit Journal Entry
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
