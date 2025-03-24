import React, { useState, useEffect } from 'react';
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
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useCompletionMutation } from '@/hooks/habits/useCompletionMutation';
import { useDismissMutation } from '@/hooks/habits/useDismissMutation';
import { useHabitContext } from '@/contexts/habits/HabitContext';
import { HabitDetail } from '@/types/habits/types';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useQuote } from './useQuote';

interface JournalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habitId: string;
  date: string;
  habitName: string;
  templateId?: string;
}

interface Quote {
  id: string;
  text: string;
  author: string;
  isFavorite: boolean;
}

const JournalModal: React.FC<JournalModalProps> = ({
  open,
  onOpenChange,
  habitId,
  date,
  habitName,
  templateId
}) => {
  const [notes, setNotes] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(date));
  const { isDarkTheme } = useUserPreferences();
  const { completeHabit } = useCompletionMutation();
  const { dismissHabit } = useDismissMutation();
  const { templates } = useHabitContext();
  const { quote, fetchQuote } = useQuote();

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  const quotes: Quote[] = [
    {
      id: '1',
      text: 'The secret of getting ahead is getting started.',
      author: 'Mark Twain',
      isFavorite: false
    },
    {
      id: '2',
      text: 'Believe you can and you\'re halfway there.',
      author: 'Theodore Roosevelt',
      isFavorite: false
    },
    {
      id: '3',
      text: 'The only way to do great work is to love what you do.',
      author: 'Steve Jobs',
      isFavorite: false
    },
    {
      id: '4',
      text: 'Strive not to be a success, but rather to be of value.',
      author: 'Albert Einstein',
      isFavorite: false
    },
    {
      id: '5',
      text: 'The future belongs to those who believe in the beauty of their dreams.',
      author: 'Eleanor Roosevelt',
      isFavorite: false
    }
  ];

  const handleComplete = () => {
    completeHabit(habitId, selectedDate.toISOString(), notes);
    toast.success(`${habitName} journal entry saved and marked complete`);
    onOpenChange(false);
  };

  const handleDismiss = () => {
    dismissHabit(habitId, selectedDate.toISOString());
    toast.success(`${habitName} dismissed for ${format(selectedDate, 'PPP')}`);
    onOpenChange(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Journal Entry</DialogTitle>
          <DialogDescription>
            Write your thoughts and reflections for {habitName} on {format(selectedDate, 'PPP')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="journal">Today's Journal</Label>
            <Textarea
              id="journal"
              placeholder="Write your thoughts here..."
              className="resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Select a Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border"
            />
          </div>

          <div className="space-y-2">
            <Label>Inspirational Quote</Label>
            <ScrollArea className="h-32 rounded-md border p-4">
              {quote ? (
                <div>
                  <p className="text-sm italic">"{quote.content}"</p>
                  <p className="text-xs text-muted-foreground mt-2">- {quote.author}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Loading quote...</p>
              )}
            </ScrollArea>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleComplete}>
            Save & Complete
          </Button>
          <Button variant="outline" onClick={handleDismiss}>
            Dismiss
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JournalModal;
