
import { useState, useEffect } from "react";
import { Note, Tag, TagColor } from "@/types/notes";
import { useNoteActions, useNoteState } from "@/contexts/notes/hooks";
import { eventManager } from "@/lib/events/EventManager";
import { toast } from "sonner";
import { findExistingJournalNote, getJournalType, getTemplateForType } from "./utils";
import { getJournalQuotes, getJournalTags } from "./constants";
import { Quote } from "@/types/timer/models";
import { EntityType } from "@/types/core";
import { JournalEntry } from "@/types/events";

interface UseJournalProps {
  habitId: string;
  habitName: string;
  description?: string;
  templateId?: string;
  taskId?: string;
  onComplete: () => void;
  onClose: () => void;
}

export const useJournal = ({
  habitId,
  habitName,
  description = "",
  templateId,
  taskId,
  onComplete,
  onClose
}: UseJournalProps) => {
  const [content, setContent] = useState("");
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);
  const [randomPrompt, setRandomPrompt] = useState<string>("");
  const [existingNote, setExistingNote] = useState<Note | null>(null);
  const noteActions = useNoteActions();
  const { notes } = useNoteState();
  
  // Determine journal type
  const journalType = getJournalType(habitName, description);
  const template = getTemplateForType(journalType);
  const relevantQuotes = getJournalQuotes(journalType);
  
  // Initialize when opening
  useEffect(() => {
    // Check for existing note by task ID first (preferred), then by habit ID
    let note: Note | undefined;
    
    if (taskId) {
      note = notes.find(n => 
        n.relationships?.some(r => 
          r.metadata?.taskId === taskId ||
          (r.entityType === EntityType.Task && r.entityId === taskId)
        )
      );
    }
    
    if (!note && habitId) {
      note = findExistingJournalNote(habitId, notes);
    }
    
    if (note) {
      // Use existing note content
      setExistingNote(note);
      setContent(note.content);
      console.log("Found existing journal note:", note);
    } else {
      // No existing note, reset to template
      resetToNewNote();
    }
  }, [habitId, taskId, notes]);
  
  // Reset to a new note with template
  const resetToNewNote = () => {
    setExistingNote(null);
    setContent(template.initialContent);
    
    // Select random quote from our filtered quotes
    const randomIndex = Math.floor(Math.random() * relevantQuotes.length);
    setRandomQuote(relevantQuotes[randomIndex] || null);
    
    // Select random prompt
    const promptIndex = Math.floor(Math.random() * template.prompts.length);
    setRandomPrompt(template.prompts[promptIndex]);
  };
  
  const handleSave = () => {
    const now = new Date().toISOString();
    
    // Create relationships array for tracking connections
    const relationships = [
      {
        entityId: habitId,
        entityType: EntityType.Habit,
        metadata: {
          templateId,
          date: now,
          journalType
        }
      }
    ];
    
    // Add task relationship if applicable
    if (taskId) {
      relationships.push({
        entityId: taskId,
        entityType: EntityType.Task,
        metadata: {
          taskId,
          date: now
        }
      });
    }
    
    // Create tags for journal entry
    const journalTags: Tag[] = [
      { name: 'journal', color: 'blue' as TagColor },
      { name: journalType, color: 
        journalType === 'gratitude' ? 'green' : 
        journalType === 'reflection' ? 'purple' : 
        journalType === 'mindfulness' ? 'teal' : 'blue' as TagColor 
      }
    ];
    
    if (existingNote) {
      // Update the existing note with new content
      noteActions.updateNote(existingNote.id, { 
        content,
        updatedAt: now,
        relationships
      });
      
      // If this was from a task, update the task's journal entry
      if (taskId) {
        eventManager.emit('task:update', {
          taskId,
          updates: {
            journalEntry: content,
            completed: true,
            completedAt: now
          }
        });
      }
      
      toast.success(`Updated journal entry for: ${habitName}`, {
        description: "Your journal entry has been updated"
      });
    } else {
      // Create a new journal entry as a note
      const journalEntry: Omit<Note, 'id'> = {
        title: `Journal: ${habitName}`,
        content,
        createdAt: now,
        updatedAt: now,
        tags: journalTags,
        relationships
      };
      
      // Add the note
      const noteId = noteActions.addNote(journalEntry);
      
      // Also emit journal:create event for compatibility
      eventManager.emit('journal:create', {
        habitId,
        habitName,
        taskId,
        templateId,
        content,
        date: now
      });
      
      // Update the task if this is from a task
      if (taskId) {
        eventManager.emit('task:update', {
          taskId,
          updates: {
            journalEntry: content,
            completed: true,
            completedAt: now
          }
        });
      }
      
      // Mark habit as completed if not already
      eventManager.emit('habit:complete', {
        habitId,
        date: now.split('T')[0], // Just the date part
        value: true
      });
      
      onComplete();
      
      toast.success(`Created new journal entry for: ${habitName}`, {
        description: "Your journal entry has been saved"
      });
    }
    
    onClose();
  };

  return {
    content,
    setContent,
    randomQuote,
    randomPrompt,
    existingNote,
    journalType,
    template,
    handleSave
  };
};
