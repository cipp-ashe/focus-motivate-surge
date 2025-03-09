import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { Quote } from "@/types/timer/models";
import { Tag, Note } from "@/types/notes";
import { useNoteActions, useNoteState } from "@/contexts/notes/NoteContext";
import { toast } from "sonner";
import { eventBus } from "@/lib/eventBus";
import { Minimize2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { relationshipManager } from "@/lib/relationshipManager";

// Add quotes specific to different journal types
const journalQuotes: Record<string, Quote[]> = {
  gratitude: [
    { 
      text: "Gratitude turns what we have into enough.", 
      author: "Melody Beattie", 
      categories: ["motivation", "growth"] 
    },
    { 
      text: "Gratitude is the healthiest of all human emotions.", 
      author: "Zig Ziglar", 
      categories: ["motivation"] 
    },
    { 
      text: "When I started counting my blessings, my whole life turned around.", 
      author: "Willie Nelson", 
      categories: ["growth"] 
    },
    { 
      text: "Gratitude is not only the greatest of virtues, but the parent of all others.", 
      author: "Cicero", 
      categories: ["motivation"] 
    },
    { 
      text: "The more grateful I am, the more beauty I see.", 
      author: "Mary Davis", 
      categories: ["creativity"] 
    }
  ],
  reflection: [
    { 
      text: "The unexamined life is not worth living.", 
      author: "Socrates", 
      categories: ["learning"] 
    },
    { 
      text: "Your vision will become clear only when you can look into your own heart.", 
      author: "Carl Jung", 
      categories: ["growth"] 
    },
    { 
      text: "Life can only be understood backwards; but it must be lived forwards.", 
      author: "Søren Kierkegaard", 
      categories: ["learning"] 
    }
  ],
  mindfulness: [
    { 
      text: "The present moment is the only time over which we have dominion.", 
      author: "Thích Nhất Hạnh", 
      categories: ["focus"] 
    },
    { 
      text: "Mindfulness isn't difficult. We just need to remember to do it.", 
      author: "Sharon Salzberg", 
      categories: ["focus"] 
    }
  ]
};

// Journal type templates
interface JournalTemplate {
  title: string;
  prompts: string[];
  placeholderText: string;
  initialContent: string;
}

const journalTemplates: Record<string, JournalTemplate> = {
  gratitude: {
    title: "Gratitude Journal",
    prompts: [
      "What are you grateful for today?",
      "Who made a positive impact on your day?",
      "What small joy did you experience?",
      "What challenge are you thankful for?",
      "What about your surroundings are you appreciative of?"
    ],
    placeholderText: "Write about what you're grateful for...",
    initialContent: "## Today I'm grateful for:\n\n1. \n2. \n3. \n\n## Why these matter to me:\n\n"
  },
  reflection: {
    title: "Reflection Journal",
    prompts: [
      "What went well today?",
      "What challenged you?",
      "What did you learn?",
      "What would you do differently?",
      "What are you looking forward to?"
    ],
    placeholderText: "Reflect on your day...",
    initialContent: "## Reflections:\n\n### What went well:\n\n\n### What challenged me:\n\n\n### What I learned:\n\n"
  },
  mindfulness: {
    title: "Mindfulness Journal",
    prompts: [
      "What are you noticing right now?",
      "How does your body feel?",
      "What emotions are present?",
      "What thoughts are you observing?",
      "What sensations are you aware of?"
    ],
    placeholderText: "Notice the present moment...",
    initialContent: "## Present moment awareness:\n\n### I notice:\n\n\n### I feel:\n\n\n### I observe:\n\n"
  }
};

// Helper function to determine journal type
const getJournalType = (habitName: string, description: string = ""): string => {
  const lowerName = habitName.toLowerCase();
  const lowerDesc = description.toLowerCase();
  
  if (lowerName.includes("gratitude") || lowerDesc.includes("gratitude")) {
    return "gratitude";
  } else if (lowerName.includes("reflect") || lowerDesc.includes("reflect")) {
    return "reflection";
  } else if (lowerName.includes("mindful") || lowerDesc.includes("mindful") || 
             lowerName.includes("meditat") || lowerDesc.includes("meditat")) {
    return "mindfulness";
  }
  
  // Default to gratitude if no match
  return "gratitude";
};

interface JournalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habitId: string;
  habitName: string;
  description?: string;
  onComplete: () => void;
  templateId?: string; // Add templateId prop
}

const JournalModal: React.FC<JournalModalProps> = ({
  open,
  onOpenChange,
  habitId,
  habitName,
  description = "",
  onComplete,
  templateId
}) => {
  const [content, setContent] = useState("");
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);
  const [randomPrompt, setRandomPrompt] = useState<string>("");
  const [existingNote, setExistingNote] = useState<Note | null>(null);
  const noteActions = useNoteActions();
  const noteState = useNoteState();
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Determine journal type
  const journalType = getJournalType(habitName, description);
  const template = journalTemplates[journalType] || journalTemplates.gratitude;
  const quotes = journalQuotes[journalType] || journalQuotes.gratitude;
  
  // Check for an existing note when opening the modal
  useEffect(() => {
    if (open) {
      // Find any related notes for this habit
      const relatedEntities = relationshipManager.getRelatedEntities(habitId, 'habit', 'note');
      
      if (relatedEntities.length > 0) {
        // We have a related note, find it in our notes collection
        const noteId = relatedEntities[0].id;
        const foundNote = noteState.items.find(note => note.id === noteId);
        
        if (foundNote) {
          // Use existing note content
          setExistingNote(foundNote);
          setContent(foundNote.content);
          console.log("Found existing journal note:", foundNote);
        } else {
          // We have a relationship but the note doesn't exist anymore
          resetToNewNote();
        }
      } else {
        // No existing note, reset to template
        resetToNewNote();
      }
    }
  }, [open, habitId, noteState.items]);
  
  // Reset to a new note with template
  const resetToNewNote = () => {
    setExistingNote(null);
    setContent(template.initialContent);
    
    // Select random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setRandomQuote(quotes[randomIndex]);
    
    // Select random prompt
    const promptIndex = Math.floor(Math.random() * template.prompts.length);
    setRandomPrompt(template.prompts[promptIndex]);
  };
  
  const handleSave = () => {
    // Check if we're updating an existing note
    if (existingNote) {
      // Update the existing note
      noteActions.updateNote(existingNote.id, {
        content: content.trim(),
        updatedAt: new Date().toISOString()
      });
      
      toast.success(`Updated journal entry for: ${habitName}`, {
        description: "Your journal entry has been updated"
      });
    } else {
      // Create tags for the journal entry
      const tags: Tag[] = [
        { name: 'journal', color: 'default' },
        { name: journalType, color: 'default' }
      ];
      
      // This note creation will be handled by the event bus
      eventBus.emit('note:create-from-habit', {
        habitId,
        habitName,
        description: description || '',
        templateId, // Pass the templateId if available
        content // Pass the content to avoid double saving
      });
      
      // Mark as completed if not already
      onComplete();
      
      toast.success(`Created new journal entry for: ${habitName}`, {
        description: "Your journal entry has been saved"
      });
    }
    
    onOpenChange(false);
  };

  if (!open) return null;
  
  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50"
    >
      {/* Overlay/Backdrop */}
      <div 
        className="fixed inset-0 bg-background/95 backdrop-blur-md" 
        aria-hidden="true"
      />
      
      {/* Content */}
      <div className="relative h-full overflow-y-auto">
        <div className="container mx-auto p-6 flex flex-col gap-6 min-h-screen max-w-[1200px]">
          {/* Header Section with Quote */}
          <Card className="bg-card/90 backdrop-blur-md shadow-lg p-6 border-primary/20">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                  {existingNote ? `Edit ${template.title}` : template.title}
                </h1>
                <Button
                  onClick={() => onOpenChange(false)}
                  className="p-2 rounded-full bg-background/80 hover:bg-background/90 transition-colors"
                  variant="ghost"
                  size="icon"
                >
                  <Minimize2 className="h-4 w-4" />
                  <span className="sr-only">Close journal</span>
                </Button>
              </div>
              
              {!existingNote && randomQuote && (
                <div className="p-4 bg-primary/5 rounded-md border border-primary/10 italic">
                  <p className="text-base">"{randomQuote.text}"</p>
                  <p className="text-sm text-muted-foreground mt-1 text-right">— {randomQuote.author}</p>
                </div>
              )}
              
              {!existingNote && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-1">Today's prompt:</p>
                  <p className="text-base font-medium">{randomPrompt}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Editor Section */}
          <Card className="bg-card/90 backdrop-blur-md shadow-lg border-primary/20 flex-1 min-h-[500px]">
            <div className="p-6 h-full flex flex-col">
              <div className="flex-1" ref={editorRef}>
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  height="100%"
                  preview="edit"
                />
              </div>
            </div>
          </Card>

          {/* Footer with Actions */}
          <Card className="bg-card/90 backdrop-blur-md shadow-lg p-4 border-primary/20">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {existingNote ? "Update Journal Entry" : "Save Journal Entry"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JournalModal;
