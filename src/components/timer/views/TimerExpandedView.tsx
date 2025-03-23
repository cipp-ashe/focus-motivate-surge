
import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, Save, X } from "lucide-react";
import { TimerExpandedViewRef } from "@/types/timer";
import { Quote } from "@/types/timer";
import { QuoteDisplay } from "../quote/QuoteDisplay";

interface TimerExpandedViewProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  onSave: () => void;
  onClose: () => void;
  quote: Quote | null;
  onNewQuote: () => void;
  onAddToFavorites: (quote: Quote) => void;
  onRemoveFromFavorites: (quoteId: string) => void;
}

export const TimerExpandedView = forwardRef<TimerExpandedViewRef, TimerExpandedViewProps>(
  ({ notes, onNotesChange, onSave, onClose, quote, onNewQuote, onAddToFavorites, onRemoveFromFavorites }, ref) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const notesRef = useRef<HTMLTextAreaElement>(null);

    const handleSave = () => {
      onSave();
    };

    const expand = () => {
      setIsExpanded(true);
    };

    const collapse = () => {
      setIsExpanded(false);
      handleSave(); // Auto-save on collapse
      onClose();
    };

    const toggleExpansion = () => {
      if (isExpanded) {
        collapse();
      } else {
        expand();
      }
    };

    const saveNotes = () => {
      handleSave();
    };

    // Expose methods to parent components
    useImperativeHandle(ref, () => ({
      expand,
      collapse,
      toggleExpansion,
      isExpanded,
      saveNotes,
      notesRef,
      handleSave
    }));

    return (
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-foreground/90">Extended Timer View</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleSave} title="Save notes">
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={collapse} title="Collapse view">
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} title="Close expanded view">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="mb-4 bg-card/50">
          <CardContent className="p-4">
            <QuoteDisplay
              quote={quote}
              onNewQuote={onNewQuote}
              onAddToFavorites={onAddToFavorites}
              onRemoveFromFavorites={onRemoveFromFavorites}
            />
          </CardContent>
        </Card>

        <div className="flex-grow flex flex-col">
          <label htmlFor="notes" className="mb-2 text-sm font-medium text-foreground/90">
            Notes
          </label>
          <Textarea
            ref={notesRef}
            id="notes"
            placeholder="Take notes during your timer session..."
            className="flex-grow resize-none bg-background/50 focus:bg-background/80 transition-colors"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
          />
        </div>
      </div>
    );
  }
);

TimerExpandedView.displayName = "TimerExpandedView";
