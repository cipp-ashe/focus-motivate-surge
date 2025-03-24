
import React, { useState, useEffect, createContext, useContext } from 'react';
import { JournalDialog } from './JournalDialog';
import { eventManager } from '@/lib/events/EventManager';
import { useJournalService } from '@/hooks/journal/useJournalService';

interface JournalContextType {
  openJournal: (data: {
    habitId?: string;
    habitName?: string;
    taskId?: string;
    templateId?: string;
    description?: string;
    date?: string;
    content?: string;
  }) => void;
}

const JournalContext = createContext<JournalContextType | null>(null);

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setupEventListeners } = useJournalService();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentJournalData, setCurrentJournalData] = useState<any>(null);

  // Set up event listeners
  useEffect(() => {
    const cleanup = setupEventListeners();
    
    // Listen specifically for journal:open events
    const openJournalUnsubscribe = eventManager.on('journal:open', (data) => {
      console.log('Journal open event received:', data);
      openJournal(data);
    });
    
    return () => {
      cleanup();
      openJournalUnsubscribe();
    };
  }, [setupEventListeners]);

  const openJournal = (data: {
    habitId?: string;
    habitName?: string;
    taskId?: string;
    templateId?: string;
    description?: string;
    date?: string;
    content?: string;
  }) => {
    setCurrentJournalData(data);
    setIsDialogOpen(true);
  };

  return (
    <JournalContext.Provider value={{ openJournal }}>
      {children}
      
      <JournalDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        journalData={currentJournalData}
      />
    </JournalContext.Provider>
  );
};
