
import React, { useState, useEffect } from 'react';
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
import { useJournalService } from '@/hooks/journal/useJournalService';
import { toast } from 'sonner';

interface JournalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  journalData?: {
    habitId?: string;
    habitName?: string;
    taskId?: string;
    description?: string;
    templateId?: string;
    date?: string;
    content?: string;
  };
}

export const JournalDialog: React.FC<JournalDialogProps> = ({
  isOpen,
  onOpenChange,
  journalData
}) => {
  const { findJournalEntry, createJournalEntry } = useJournalService();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');

  // Reset states when dialog opens or journalData changes
  useEffect(() => {
    if (isOpen && journalData) {
      console.log("Journal dialog opened with data:", journalData);
      
      // Find existing entry if any
      const existingEntry = findJournalEntry({
        habitId: journalData.habitId,
        taskId: journalData.taskId,
        date: journalData.date
      });
      
      if (existingEntry) {
        // Use existing entry data
        setEditedTitle(existingEntry.title);
        setEditedContent(existingEntry.content);
        // If there's existing content, don't start in editing mode
        setIsEditing(false);
      } else {
        // No existing entry, set default values and start in editing mode
        setEditedTitle(journalData.habitName ? `Journal: ${journalData.habitName}` : 'Journal Entry');
        setEditedContent(journalData.content || '');
        setIsEditing(true);
      }
    }
  }, [isOpen, journalData, findJournalEntry]);

  const handleSaveEdit = () => {
    if (!editedTitle.trim()) {
      toast.error('Title cannot be empty');
      return;
    }

    if (!journalData) {
      toast.error('Missing journal data');
      return;
    }

    const { habitId, habitName, taskId, templateId, date } = journalData;
    
    // Create or update journal entry
    createJournalEntry({
      habitId,
      habitName: habitName || editedTitle,
      taskId,
      templateId,
      title: editedTitle.trim(),
      content: editedContent.trim(),
      date: date || new Date().toISOString()
    });

    setIsEditing(false);
    toast.success('Journal entry saved');
    
    // Close dialog after saving
    setTimeout(() => onOpenChange(false), 500);
  };

  const handleCancelEdit = () => {
    // Reset to original values
    if (journalData) {
      setEditedTitle(journalData.habitName ? `Journal: ${journalData.habitName}` : 'Journal Entry');
      setEditedContent(journalData.content || '');
    }
    setIsEditing(false);
  };

  // Prevent auto-closing when clicking inside editor
  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto" onClick={handleDialogClick}>
        <DialogHeader className="flex flex-col space-y-1.5 pb-2">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Journal entry title"
                className="font-medium"
                autoFocus
              />
            </div>
          ) : (
            <DialogTitle className="text-xl">{editedTitle}</DialogTitle>
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
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Write your journal entry here..."
              className="min-h-[400px] text-sm"
              autoFocus={!editedContent}
            />
          ) : (
            <div className="whitespace-pre-wrap bg-muted/30 p-4 rounded-md min-h-[400px] text-sm">
              {editedContent || 'No journal entry yet.'}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
