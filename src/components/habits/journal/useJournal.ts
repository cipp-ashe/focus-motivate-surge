
import { useState, useEffect } from "react";
import { Note } from "@/types/notes";
import { useNoteActions, useNoteState } from "@/contexts/notes/NoteContext";
import { eventManager } from "@/lib/events/EventManager";
import { toast } from "sonner";
import { findExistingJournalNote, getJournalType, getTemplateForType } from "./utils";
import { getJournalQuotes, getJournalTags } from "./constants";
import { Quote } from "@/types/timer/models";
import { EntityType } from "@/types/core";

interface UseJournalProps {
  habitId: string;
  habitName: string;
  description?: string;
  templateId?: string;
  onComplete: () => void;
  onClose: () => void;
}

export const useJournal = ({
  habitId,
  habitName,
  description = "",
  templateId,
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
    const note = findExistingJournalNote(habitId, notes);
    
    if (note) {
      // Use existing note content
      setExistingNote(note);
      setContent(note.content);
      console.log("Found existing journal note:", note);
    } else {
      // No existing note, reset to template
      resetToNewNote();
    }
  }, [habitId, notes]);
  
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
    // Check if we're updating an existing note
    if (existingNote) {
      // Update the existing note with new content
      noteActions.updateNote(existingNote.id, { content });
      
      toast.success(`Updated journal entry for: ${habitName}`, {
        description: "Your journal entry has been updated"
      });
    } else {
      // Emit event to create a note from the habit
      eventManager.emit('note:create-from-habit', {
        habitId,
        habitName,
        content,
        templateId
      });
      
      // Mark as completed if not already
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
