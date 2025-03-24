
/**
 * Journal Storage Module
 * 
 * Handles local storage operations for journal entries.
 */
import { EventPayloadMap } from '@/types/events';
import { v4 as uuidv4 } from 'uuid';

export interface JournalEntry {
  id: string;
  content: string;
  date: string;
  habitId?: string;
  templateId?: string;
  createdAt?: string;
  updatedAt?: string;
}

const STORAGE_KEY = 'journal-entries';

class JournalStorage {
  private getEntries(): JournalEntry[] {
    try {
      const entriesString = localStorage.getItem(STORAGE_KEY);
      if (!entriesString) return [];
      
      const entries = JSON.parse(entriesString);
      return Array.isArray(entries) ? entries : [];
    } catch (error) {
      console.error('Error loading journal entries:', error);
      return [];
    }
  }
  
  private saveEntries(entries: JournalEntry[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      return true;
    } catch (error) {
      console.error('Error saving journal entries:', error);
      return false;
    }
  }
  
  public getEntryById(id: string): JournalEntry | null {
    const entries = this.getEntries();
    return entries.find(entry => entry.id === id) || null;
  }
  
  public getEntryForHabitOnDate(habitId: string, date: string): JournalEntry | null {
    const entries = this.getEntries();
    return entries.find(entry => entry.habitId === habitId && entry.date === date) || null;
  }
  
  public saveEntry(entry: JournalEntry): boolean {
    // Ensure the entry has an ID
    const entryWithId = {
      ...entry,
      id: entry.id || uuidv4(),
      updatedAt: new Date().toISOString()
    };
    
    // If it's a new entry, set the createdAt timestamp
    if (!entry.createdAt) {
      entryWithId.createdAt = new Date().toISOString();
    }
    
    const entries = this.getEntries();
    const existingIndex = entries.findIndex(e => e.id === entryWithId.id);
    
    if (existingIndex >= 0) {
      // Update existing entry
      entries[existingIndex] = entryWithId;
    } else {
      // Add new entry
      entries.push(entryWithId);
    }
    
    return this.saveEntries(entries);
  }
  
  public deleteEntry(id: string): boolean {
    const entries = this.getEntries();
    const filteredEntries = entries.filter(entry => entry.id !== id);
    
    if (filteredEntries.length === entries.length) {
      // No entry was removed
      return false;
    }
    
    return this.saveEntries(filteredEntries);
  }
  
  public getEntriesForHabit(habitId: string, limit?: number): JournalEntry[] {
    const entries = this.getEntries();
    const habitEntries = entries.filter(entry => entry.habitId === habitId);
    
    // Sort by date descending
    habitEntries.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    // Apply limit if specified
    return limit ? habitEntries.slice(0, limit) : habitEntries;
  }
  
  public getRecentEntries(limit: number = 5): JournalEntry[] {
    const entries = this.getEntries();
    
    // Sort by updated timestamp descending
    entries.sort((a, b) => {
      const dateA = a.updatedAt || a.createdAt || a.date;
      const dateB = b.updatedAt || b.createdAt || b.date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
    
    return entries.slice(0, limit);
  }
}

export const journalStorage = new JournalStorage();
