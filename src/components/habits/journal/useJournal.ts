
import { useState, useEffect, useCallback } from 'react';
import { journalStorage } from '@/lib/storage/journalStorage';
import { eventManager } from '@/lib/events/EventManager';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { JournalEntry } from '@/types/events';

export const useJournal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [journalId, setJournalId] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [habitId, setHabitId] = useState<string | null>(null);
  const [habitName, setHabitName] = useState<string>('');
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [journalType, setJournalType] = useState<'habit' | 'task'>('habit');
  
  // Set up event listeners
  useEffect(() => {
    const handleJournalOpen = (data: any) => {
      console.log('Journal: Received open event', data);
      
      // Extract data from the event
      const {
        habitId: eventHabitId,
        habitName: eventHabitName,
        templateId: eventTemplateId,
        description,
        date: eventDate,
        taskId
      } = data;
      
      // Set journal type
      if (taskId) {
        setJournalType('task');
      } else {
        setJournalType('habit');
      }
      
      // Set component state
      setHabitId(eventHabitId || null);
      setHabitName(eventHabitName || description || 'Journal Entry');
      setTemplateId(eventTemplateId || null);
      setDate(eventDate || new Date().toISOString().split('T')[0]);
      
      // Try to load existing entry for this habit/date
      if (eventHabitId && eventDate) {
        const existingEntry = journalStorage.getEntryForHabitOnDate(eventHabitId, eventDate);
        
        if (existingEntry) {
          setContent(existingEntry.content);
          setJournalId(existingEntry.id);
        } else {
          setContent('');
          setJournalId(null);
        }
      } else {
        setContent('');
        setJournalId(null);
      }
      
      // Open the journal
      setIsOpen(true);
    };
    
    const handleJournalClose = () => {
      setIsOpen(false);
    };
    
    const handleJournalGet = (data: any) => {
      const { habitId, date } = data;
      const entry = journalStorage.getEntryForHabitOnDate(habitId, date);
      return entry;
    };
    
    // Subscribe to events
    const unsubscribeOpen = eventManager.on('journal:open', handleJournalOpen);
    const unsubscribeClose = eventManager.on('journal:close', handleJournalClose);
    const unsubscribeGet = eventManager.on('journal:get', handleJournalGet);
    
    return () => {
      unsubscribeOpen();
      unsubscribeClose();
      unsubscribeGet();
    };
  }, []);
  
  // Save journal entry
  const saveJournalEntry = useCallback(() => {
    if (!content.trim()) {
      toast.error('Please add some content before saving');
      return false;
    }
    
    try {
      // Create entry object
      const entry: JournalEntry = {
        id: journalId || uuidv4(),
        content,
        date,
        habitId: habitId || undefined,
        templateId: templateId || undefined
      };
      
      // Save using storage
      journalStorage.saveEntry(entry);
      
      // Set ID for future reference
      setJournalId(entry.id);
      
      // Emit event for journaling activity
      const payload: any = {
        id: entry.id,
        content,
        date,
        journalType
      };
      
      if (journalType === 'habit') {
        payload.habitId = habitId;
        payload.templateId = templateId;
      } else {
        payload.taskId = habitId; // For task journals
      }
      
      eventManager.emit('journal:save', payload);
      
      toast.success('Journal entry saved');
      return true;
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast.error('Failed to save journal entry');
      return false;
    }
  }, [content, date, habitId, templateId, journalId, journalType]);
  
  // Close journal
  const closeJournal = useCallback(() => {
    setIsOpen(false);
    eventManager.emit('journal:close', undefined);
  }, []);
  
  // Handle save and close
  const handleSaveAndClose = useCallback(() => {
    const success = saveJournalEntry();
    if (success) {
      closeJournal();
    }
  }, [saveJournalEntry, closeJournal]);
  
  return {
    isOpen,
    content,
    setContent,
    habitId,
    habitName,
    templateId,
    date,
    journalType,
    saveJournalEntry,
    closeJournal,
    handleSaveAndClose
  };
};
