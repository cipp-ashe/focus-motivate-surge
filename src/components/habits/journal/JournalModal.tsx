
import React, { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { Quote } from "@/types/timer/models";
import { Tag } from "@/types/notes";
import { useNoteActions } from "@/contexts/notes/NoteContext";
import { toast } from "sonner";
import { eventBus } from "@/lib/eventBus";

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
}

const JournalModal: React.FC<JournalModalProps> = ({
  open,
  onOpenChange,
  habitId,
  habitName,
  description = "",
  onComplete
}) => {
  const [content, setContent] = useState("");
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);
  const noteActions = useNoteActions();
  
  // Determine journal type
  const journalType = getJournalType(habitName, description);
  const template = journalTemplates[journalType] || journalTemplates.gratitude;
  const quotes = journalQuotes[journalType] || journalQuotes.gratitude;
  
  // Initialize content from template
  useEffect(() => {
    if (open) {
      setContent(template.initialContent);
      
      // Select random quote
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setRandomQuote(quotes[randomIndex]);
    }
  }, [open, journalType]);
  
  const handleSave = () => {
    // Create a new note with data from the habit
    const tags: Tag[] = [
      { name: 'journal', color: 'default' }, 
      { name: journalType, color: 'default' },
      { name: habitName.toLowerCase().replace(/\s+/g, '-'), color: 'default' }
    ];
    
    const newNote = {
      title: `${habitName} - ${new Date().toLocaleDateString()}`,
      content,
      tags
    };
    
    // Add the note using the context
    noteActions.addNote(newNote);
    
    // Mark as completed
    onComplete();
    
    // Use event bus for any other components that might be listening
    eventBus.emit('note:create-from-habit', {
      habitId,
      habitName,
      description: description || ''
    });
    
    toast.success(`Created new journal entry for: ${habitName}`, {
      description: "Your journal entry has been saved"
    });
    
    onOpenChange(false);
  };
  
  const renderPrompt = () => {
    // Pick a random prompt each time
    const randomIndex = Math.floor(Math.random() * template.prompts.length);
    return template.prompts[randomIndex];
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">{template.title}</DialogTitle>
          {randomQuote && (
            <div className="mt-2 p-3 bg-primary/5 rounded-md border border-primary/10 italic text-sm">
              "{randomQuote.text}"
              <div className="text-xs text-muted-foreground mt-1 text-right">— {randomQuote.author}</div>
            </div>
          )}
          <div className="mt-2 text-sm text-muted-foreground">
            Prompt: <span className="font-medium text-foreground">{renderPrompt()}</span>
          </div>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 mt-2">
          <MarkdownEditor
            value={content}
            onChange={setContent}
            height="100%"
            preview="edit"
          />
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Journal Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JournalModal;
