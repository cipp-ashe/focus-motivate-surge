
import React from "react";
import { Button } from "@/components/ui/button";
import { Minimize2 } from "lucide-react";
import { Quote } from "@/types/timer/models";

interface JournalHeaderProps {
  title: string;
  isExistingNote: boolean;
  quote: Quote | null; 
  prompt: string;
  onClose: () => void;
}

const JournalHeader: React.FC<JournalHeaderProps> = ({
  title,
  isExistingNote,
  quote,
  prompt,
  onClose
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
          {isExistingNote ? `Edit ${title}` : title}
        </h1>
        <Button
          onClick={onClose}
          className="p-2 rounded-full bg-background/80 hover:bg-background/90 transition-colors"
          variant="ghost"
          size="icon"
        >
          <Minimize2 className="h-4 w-4" />
          <span className="sr-only">Close journal</span>
        </Button>
      </div>
      
      {!isExistingNote && quote && (
        <div className="p-4 bg-primary/5 rounded-md border border-primary/10 italic">
          <p className="text-base">"{quote.text}"</p>
          <p className="text-sm text-muted-foreground mt-1 text-right">— {quote.author}</p>
        </div>
      )}
      
      {!isExistingNote && (
        <div className="mt-2">
          <p className="text-sm text-muted-foreground mb-1">Today's prompt:</p>
          <p className="text-base font-medium">{prompt}</p>
        </div>
      )}
    </div>
  );
};

export default JournalHeader;
