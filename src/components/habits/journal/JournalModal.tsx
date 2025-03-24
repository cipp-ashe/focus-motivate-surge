import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'sonner';
import { useJournalService } from '@/hooks/journal/useJournalService';
import { useEvent } from '@/hooks/useEvent';
import { EntityType } from '@/types/core';
import { Quote } from '@/types/timer';
import { v4 as uuidv4 } from 'uuid';

interface JournalModalProps {
  open: boolean;
  onClose: () => void;
  habitId?: string;
  habitName?: string;
  templateId?: string;
  taskId?: string;
  date?: string;
}

export const JournalModal: React.FC<JournalModalProps> = ({
  open,
  onClose,
  habitId,
  habitName,
  templateId,
  taskId,
  date
}) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [journalId, setJournalId] = useState<string | null>(null);
  const { createJournalEntry, updateJournalEntry } = useJournalService();
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  
  // Load journal entry if it exists
  useEffect(() => {
    if (open && (habitId || taskId)) {
      // Fetch journal entry by habitId and date
      const fetchJournal = async () => {
        // Create a unique ID for the journal entry
        const newJournalId = uuidv4();
        setJournalId(newJournalId);
        
        // Set default title
        setTitle(`Journal Entry`);
      };
      
      fetchJournal();
    } else {
      setContent('');
      setTitle('');
      setJournalId(null);
      setSelectedQuote(null);
    }
  }, [open, habitId, taskId, createJournalEntry]);
  
  // Handle journal creation
  useEvent('journal:create', (data) => {
    if (data && data.habitId === habitId) {
      setContent(data.content || '');
    }
  });
  
  // Handle journal updates
  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Journal entry cannot be empty');
      return;
    }
    
    try {
      if (journalId) {
        // Update existing journal entry
        await updateJournalEntry({ id: journalId, content, title });
        toast.success('Journal entry updated successfully');
      } else {
        // Create new journal entry
        await createJournalEntry({
          habitId,
          habitName,
          templateId,
          taskId,
          date,
          content
        });
        toast.success('Journal entry created successfully');
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast.error('Failed to save journal entry');
    }
  };
  
  // Handle quote selection
  const handleQuoteSelect = useCallback((quote: Quote) => {
    setSelectedQuote(quote);
    setContent(`${content}\n\n> ${quote.text} - ${quote.author}`);
  }, [content]);
  
  // Sample quotes
  const quotes = [
    { 
      id: "quote1",
      text: "The secret of getting ahead is getting started.",
      author: "Mark Twain",
      isFavorite: false
    },
    { 
      id: "quote2",
      text: "The journey of a thousand miles begins with one step.",
      author: "Lao Tzu",
      isFavorite: false
    }
  ];
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Journal Entry</DialogTitle>
          <DialogDescription>
            Write your thoughts and reflections.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="journal-content">Content</Label>
            <Textarea
              id="journal-content"
              placeholder="Write your journal entry here..."
              className="min-h-[150px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Inspirational Quotes</Label>
            <ScrollArea className="h-40">
              <div className="grid grid-cols-1 gap-2 p-2">
                {quotes.map((quote) => (
                  <Button
                    key={quote.id}
                    variant="outline"
                    className="justify-start text-sm"
                    onClick={() => handleQuoteSelect(quote)}
                  >
                    {quote.text} - {quote.author}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        
        <Button onClick={handleSave}>Save Entry</Button>
      </DialogContent>
    </Dialog>
  );
};
