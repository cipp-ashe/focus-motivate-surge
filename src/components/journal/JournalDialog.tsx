
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Pencil, Save } from 'lucide-react';
import { useJournalService } from '@/hooks/journal/useJournalService';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { marked } from 'marked';
import { eventManager } from '@/lib/events/EventManager';

interface JournalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  journalData: {
    id?: string;
    habitId?: string;
    habitName?: string;
    taskId?: string;
    title?: string;
    content?: string;
    templateId?: string;
    description?: string;
    date?: string;
  } | null;
}

export const JournalDialog: React.FC<JournalDialogProps> = ({
  isOpen,
  onOpenChange,
  journalData
}) => {
  const { createJournalEntry, findJournalEntry } = useJournalService();
  const [journalContent, setJournalContent] = useState('');
  const [journalTitle, setJournalTitle] = useState('');
  const [activeTab, setActiveTab] = useState<string>("write");
  const [isEditing, setIsEditing] = useState(false);
  
  // Determine if this is a new entry
  const isNewEntry = !journalData?.content;

  useEffect(() => {
    if (journalData) {
      const title = journalData.title || 
                  (journalData.habitName ? `Journal: ${journalData.habitName}` : 'Journal Entry');
      
      setJournalTitle(title);
      
      // If we have an existing entry ID, try to find it
      if (journalData.id) {
        const existingEntry = findJournalEntry({ id: journalData.id });
        if (existingEntry) {
          setJournalContent(existingEntry.content);
          setIsEditing(false);
          setActiveTab("preview");
          return;
        }
      }
      
      // Look for existing entries by relationship
      const existingEntry = findJournalEntry({ 
        habitId: journalData.habitId,
        taskId: journalData.taskId,
        date: journalData.date ? journalData.date.split('T')[0] : undefined
      });
      
      if (existingEntry) {
        setJournalContent(existingEntry.content);
        setIsEditing(false);
        setActiveTab("preview");
      } else {
        // For new entries, start in edit mode with writing tab active
        setJournalContent(journalData.content || '');
        setIsEditing(true);
        setActiveTab("write");
      }
    }
  }, [journalData, findJournalEntry]);

  const saveJournal = () => {
    if (!journalData) return;
    
    if (journalContent.trim()) {
      const id = createJournalEntry({
        habitId: journalData.habitId,
        habitName: journalData.habitName,
        taskId: journalData.taskId,
        templateId: journalData.templateId,
        title: journalTitle,
        content: journalContent.trim(),
        date: journalData.date
      });
      
      if (journalData.taskId) {
        // Mark task as completed
        eventManager.emit('task:complete', {
          taskId: journalData.taskId,
          metrics: {
            completionDate: new Date().toISOString()
          }
        });
      }
      
      toast.success(`Saved journal entry: ${journalTitle}`);
      setIsEditing(false);
      onOpenChange(false);
    } else {
      toast.error("Cannot save empty journal entry");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };
  
  const handleEdit = () => {
    setIsEditing(true);
    setActiveTab("write");
  };
  
  const handleCancel = () => {
    if (isEditing) {
      if (isNewEntry) {
        onOpenChange(false);
      } else {
        setIsEditing(false);
        setActiveTab("preview");
        if (journalData && journalData.content) {
          setJournalContent(journalData.content);
        }
      }
    } else {
      onOpenChange(false);
    }
  };

  const dialogTitle = isNewEntry 
    ? `New Journal Entry: ${journalData?.habitName || journalData?.title || 'Untitled'}` 
    : journalTitle;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>{dialogTitle}</DialogTitle>
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
                  placeholder={isNewEntry ? "Write your thoughts here..." : "Edit your journal entry..."}
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
            
            <DialogFooter className="pt-4">
              <div className="flex justify-end gap-2 w-full">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button 
                  onClick={saveJournal} 
                  type="button"
                  disabled={!journalContent.trim()}
                >
                  <Save className="h-4 w-4 mr-2" /> Save Journal Entry
                </Button>
              </div>
            </DialogFooter>
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
            
            <DialogFooter className="pt-4">
              <div className="flex justify-end gap-2 w-full">
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
                <Button onClick={handleEdit}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit Journal Entry
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
