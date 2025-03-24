
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { eventManager } from '@/lib/events/EventManager';
import { useNoteActions } from '@/contexts/notes/hooks';
import { EntityType } from '@/types/core';

interface JournalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentTask: {
    taskId: string;
    taskName: string;
    entry: string;
  };
}

const JournalDialog: React.FC<JournalDialogProps> = ({ 
  isOpen, 
  onOpenChange,
  currentTask
}) => {
  const [journalContent, setJournalContent] = useState("");
  const { addNote, updateNote } = useNoteActions();
  
  useEffect(() => {
    if (currentTask?.entry) {
      setJournalContent(currentTask.entry);
    } else {
      setJournalContent("");
    }
  }, [currentTask]);
  
  const handleSave = () => {
    if (!journalContent.trim()) {
      toast.error("Journal entry cannot be empty");
      return;
    }
    
    try {
      // Update task with journal entry
      eventManager.emit('task:update', {
        taskId: currentTask.taskId,
        updates: { 
          journalEntry: journalContent 
        }
      });
      
      // Also update any corresponding note or create a new one
      const now = new Date().toISOString();
      
      // Create a relationship to the task
      const relationship = {
        entityId: currentTask.taskId,
        entityType: EntityType.Task,
        metadata: {
          date: now
        }
      };
      
      // Create or update a note for this journal entry
      // We'll create a new one for simplicity in this implementation
      addNote({
        title: `Journal: ${currentTask.taskName}`,
        content: journalContent,
        tags: [{ name: 'journal', color: 'blue' }],
        relationships: [relationship],
        createdAt: now,
        updatedAt: now
      });
      
      toast.success("Journal entry saved");
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving journal entry:", error);
      toast.error("Failed to save journal entry");
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Journal Entry: {currentTask?.taskName}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
            className="min-h-[300px] p-4"
            placeholder="Write your journal entry here..."
            autoFocus
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JournalDialog;
