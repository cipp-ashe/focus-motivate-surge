
import { useState, useEffect, useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { JournalEntry } from '@/types/events';

interface JournalTemplateData {
  title: string;
  description?: string;
  habitId?: string;
  habitName?: string;
  templateId?: string;
  taskId?: string;
}

export const useJournal = ({
  habitId,
  habitName,
  description,
  templateId,
  taskId,
  onComplete,
  onClose
}: {
  habitId?: string;
  habitName: string;
  description?: string;
  templateId?: string;
  taskId?: string;
  onComplete: () => void;
  onClose: () => void;
}) => {
  const [content, setContent] = useState('');
  const [existingNote, setExistingNote] = useState<JournalEntry | null>(null);
  const [template, setTemplate] = useState<JournalTemplateData>({
    title: habitName || 'Journal Entry',
    description: description || '',
    habitId,
    templateId,
    taskId
  });
  
  // Random quotes for inspiration
  const quotes = [
    { text: "The unexamined life is not worth living.", author: "Socrates" },
    { text: "To know thyself is the beginning of wisdom.", author: "Socrates" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
    { text: "We must be willing to let go of the life we've planned, so as to have the life that is waiting for us.", author: "Joseph Campbell" }
  ];
  
  // Random prompts for reflection
  const prompts = [
    "What went well today? What didn't go as planned?",
    "What's one thing you learned today?",
    "What are three things you're grateful for right now?",
    "What's something that challenged you today?",
    "What's one thing you want to focus on tomorrow?"
  ];
  
  // Get a random quote and prompt
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  
  // Save journal entry
  const handleSave = useCallback(() => {
    if (!content.trim()) {
      toast.error("Please write something before saving");
      return;
    }
    
    const date = new Date().toISOString().split('T')[0];
    const id = existingNote?.id || uuidv4();
    
    // Create journal entry
    const entry: JournalEntry = {
      id,
      content,
      date,
      habitId,
      templateId,
      taskId
    };
    
    // Emit journal save event
    eventManager.emit('journal:save', {
      id,
      content,
      date,
      habitId,
      templateId,
      journalType: taskId ? 'task' : 'habit'
    });
    
    // Also emit a note creation event to save in notes section
    if (habitId || taskId) {
      eventManager.emit('journal:create', {
        habitId,
        taskId,
        title: habitName,
        content,
        templateId,
        date
      });
    }
    
    toast.success("Journal entry saved");
    
    // Mark as completed
    if (typeof onComplete === 'function') {
      onComplete();
    }
    
    // Close the journal
    if (typeof onClose === 'function') {
      onClose();
    }
  }, [content, habitId, templateId, taskId, existingNote, habitName, onComplete, onClose]);
  
  // Check for existing journal entry
  useEffect(() => {
    if (habitId) {
      const today = new Date().toISOString().split('T')[0];
      
      try {
        // Attempt to load from local storage (this would be replaced by proper storage in a real app)
        const journalStorageKey = 'journal-entries';
        const storedJournals = localStorage.getItem(journalStorageKey);
        
        if (storedJournals) {
          const journals = JSON.parse(storedJournals);
          const existing = journals.find((j: JournalEntry) => 
            j.habitId === habitId && 
            j.date?.startsWith(today)
          );
          
          if (existing) {
            setExistingNote(existing);
            setContent(existing.content);
          }
        }
      } catch (error) {
        console.error('Error loading journal entries:', error);
      }
    }
  }, [habitId]);
  
  return {
    content,
    setContent,
    randomQuote,
    randomPrompt,
    existingNote,
    template,
    handleSave
  };
};
